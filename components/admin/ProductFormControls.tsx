"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Link as LinkIcon, Save } from "lucide-react";

// ─── 1. STRUCTURED DIMENSIONS INPUT ───────────────────────
interface DimensionItem {
  id: number;
  h: string; // Tinggi
  w: string; // Lebar
  l: string; // Panjang
  unit: string;
}

interface DimensionsInputProps {
  initialValues?: string[];
}

export function StructuredDimensionsInput({ initialValues = [""] }: DimensionsInputProps) {
  const fallbackPresets = [
    { label: "Kursi Standar", h: "90", w: "45", l: "45" },
    { label: "Meja Makan M", h: "75", w: "80", l: "120" },
    { label: "Meja Makan L", h: "75", w: "90", l: "180" },
    { label: "Meja Kopi", h: "45", w: "60", l: "60" },
    { label: "Lemari Buku", h: "180", w: "40", l: "100" },
    { label: "Tempat Tidur M", h: "35", w: "200", l: "160" }
  ];

  const [presets, setPresets] = useState<Array<{ label: string; h: string; w: string; l: string }>>(fallbackPresets);
  const [presetsLoaded, setPresetsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dimension_presets");
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch {}
    }
    setPresetsLoaded(true);
  }, []);

  useEffect(() => {
    if (presetsLoaded && typeof window !== "undefined") {
      localStorage.setItem("dimension_presets", JSON.stringify(presets));
    }
  }, [presets, presetsLoaded]);

  const [items, setItems] = useState<DimensionItem[]>(() => {
    return initialValues.map((val, idx) => {
      // Try T [H] x L [W] x P [L] [Unit]
      const matchNew = val.match(/^T\s*(\d+)\s*x\s*L\s*(\d+)\s*x\s*P\s*(\d+)\s*(cm|mm|m)$/i);
      if (matchNew) {
        return {
          id: idx,
          h: matchNew[1],
          w: matchNew[2],
          l: matchNew[3],
          unit: matchNew[4]
        };
      }
      // Try [L]x[W]x[H] [Unit]
      const matchOld = val.match(/^(\d+)x(\d+)x(\d+)\s*(cm|mm|m)$/i);
      if (matchOld) {
        return {
          id: idx,
          l: matchOld[1],
          w: matchOld[2],
          h: matchOld[3],
          unit: matchOld[4]
        };
      }
      // Try extraction from strings like "P 80cm x L 40cm x T 180cm"
      const pMatch = val.match(/P\s*(\d+)/i);
      const lMatch = val.match(/L\s*(\d+)/i);
      const tMatch = val.match(/T\s*(\d+)/i);
      const unitMatch = val.match(/(cm|mm|m)/i);
      if (pMatch || lMatch || tMatch) {
        return {
          id: idx,
          l: pMatch ? pMatch[1] : "",
          w: lMatch ? lMatch[1] : "",
          h: tMatch ? tMatch[1] : "",
          unit: unitMatch ? unitMatch[1] : "cm"
        };
      }
      return {
        id: idx,
        h: "",
        w: "",
        l: "",
        unit: "cm"
      };
    });
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), h: "", w: "", l: "", unit: "cm" }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, fields: Partial<DimensionItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...fields } : item)));
  };

  const applyPreset = (id: number, preset: typeof presets[0]) => {
    updateItem(id, {
      h: preset.h,
      w: preset.w,
      l: preset.l,
      unit: "cm"
    });
  };

  const handleSavePreset = (item: DimensionItem) => {
    if (!item.h || !item.w || !item.l) {
      alert("Mohon isi semua dimensi (Tinggi, Lebar, Panjang) sebelum disimpan sebagai template.");
      return;
    }
    const label = prompt("Masukkan nama/label untuk template ukuran baru ini:", "Template Baru");
    if (label && label.trim()) {
      const trimmedLabel = label.trim();
      if (presets.some((p) => p.label.toLowerCase() === trimmedLabel.toLowerCase())) {
        alert("Template dengan nama ini sudah ada.");
        return;
      }
      setPresets((prev) => [
        ...prev,
        { label: trimmedLabel, h: item.h, w: item.w, l: item.l }
      ]);
    }
  };

  const handleDeletePreset = (label: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus template "${label}"?`)) {
      setPresets((prev) => prev.filter((p) => p.label !== label));
    }
  };

  // State to manage template list deletion
  const [isManaging, setIsManaging] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

  const handleBulkDeletePresets = () => {
    if (selectedPresets.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedPresets.length} template ukuran yang dipilih?`)) {
      setPresets((prev) => prev.filter((p) => !selectedPresets.includes(p.label)));
      setSelectedPresets([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Ukuran / Dimensi *</label>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Tinggi (T) x Lebar (L) x Panjang (P)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsManaging(!isManaging);
              setSelectedPresets([]);
            }}
            className={`text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg border ${
              isManaging
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
                : "bg-white border-[#EAEAEA] text-zinc-600 hover:bg-[#F5F5F5] dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {isManaging ? "Selesai" : "Kelola Template"}
          </button>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-brand-gold/80"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ukuran</span>
          </button>
        </div>
      </div>

      {/* Bulk Delete Dashboard */}
      {isManaging && presets.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200/40 dark:border-red-900/30 bg-red-50/10 dark:bg-red-950/5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark dark:text-zinc-200">Kelola Template Sizing ({presets.length})</span>
            {selectedPresets.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDeletePresets}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedPresets.length})</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {presets.map((preset) => {
              const isChecked = selectedPresets.includes(preset.label);
              return (
                <label 
                  key={preset.label}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/50"
                      : "bg-white dark:bg-zinc-900 border-[#EAEAEA] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedPresets(selectedPresets.filter((lbl) => lbl !== preset.label));
                      } else {
                        setSelectedPresets([...selectedPresets, preset.label]);
                      }
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                  />
                  <div className="text-left truncate flex-1">
                    <p className="text-xs font-semibold text-brand-dark dark:text-zinc-200 truncate">{preset.label}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{preset.h}x{preset.w}x{preset.l} cm</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => {
          const finalValue =
            item.h && item.w && item.l
              ? `T ${item.h} x L ${item.w} x P ${item.l} ${item.unit}`
              : "";

          return (
            <div key={item.id} className="relative p-4 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20 space-y-4">
              <input type="hidden" name="dimensions" value={finalValue} />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-brand-dark/40 dark:text-zinc-500 uppercase tracking-wider">Dimensi #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSavePreset(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all text-brand-gold hover:bg-brand-gold/10"
                    title="Simpan ukuran ini sebagai template rekomendasi"
                  >
                    <Save className="w-3 h-3" />
                    <span>Simpan Template</span>
                  </button>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      title="Hapus Dimensi Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* T, L, P inputs */}
              <div className="grid grid-cols-4 gap-3 items-end">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Tinggi (T)</label>
                  <input
                    type="number"
                    placeholder="Tinggi"
                    required
                    value={item.h}
                    onChange={(e) => updateItem(item.id, { h: e.target.value })}
                    className="w-full text-center px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Lebar (L)</label>
                  <input
                    type="number"
                    placeholder="Lebar"
                    required
                    value={item.w}
                    onChange={(e) => updateItem(item.id, { w: e.target.value })}
                    className="w-full text-center px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Panjang (P)</label>
                  <input
                    type="number"
                    placeholder="Panjang"
                    required
                    value={item.l}
                    onChange={(e) => updateItem(item.id, { l: e.target.value })}
                    className="w-full text-center px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Satuan (Unit)</label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                    className="w-full px-2 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 font-semibold"
                  >
                    <option value="cm">cm (Centimeter)</option>
                    <option value="mm">mm (Millimeter)</option>
                    <option value="m">m (Meter)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Preset Recommendations */}
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mr-1 shrink-0">Rekomendasi:</span>
                {presets.map((preset) => (
                  <span 
                    key={preset.label}
                    className="inline-flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => applyPreset(item.id, preset)}
                      className="pl-2.5 pr-1 py-0.5 text-[9px] font-semibold text-brand-dark dark:text-zinc-300 text-left"
                    >
                      {preset.label} ({preset.h}x{preset.w}x{preset.l})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePreset(preset.label)}
                      className="pr-2 pl-1.5 text-xs text-zinc-400 hover:text-red-500 font-bold transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
                      title="Hapus template"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── 3. STRUCTURED MATERIALS INPUT ────────────────────────
interface MaterialsInputProps {
  initialValues?: string[];
}

export function StructuredMaterialsInput({ initialValues = [""] }: MaterialsInputProps) {
  const [list, setList] = useState<string[]>(initialValues.filter(Boolean));
  const [customInput, setCustomInput] = useState("");

  const fallbackSuggestions = [
    "Kayu Jati Solid",
    "Kayu Mahoni",
    "Kayu Mindi",
    "Besi Hollow",
    "Stainless Steel",
    "Rattan Alami",
    "Kain Linen Premium",
    "Busa High Density"
  ];

  const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("material_suggestions");
    if (saved) {
      try {
        setSuggestions(JSON.parse(saved));
      } catch {}
    }
    setSuggestionsLoaded(true);
  }, []);

  useEffect(() => {
    if (suggestionsLoaded && typeof window !== "undefined") {
      localStorage.setItem("material_suggestions", JSON.stringify(suggestions));
    }
  }, [suggestions, suggestionsLoaded]);

  const toggleMaterial = (mat: string) => {
    if (list.includes(mat)) {
      setList(list.filter((m) => m !== mat));
    } else {
      setList([...list, mat]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      
      // Auto-save to dynamic templates/suggestions if not already there
      if (!suggestions.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        setSuggestions((prev) => [...prev, trimmed]);
      }
      setCustomInput("");
    }
  };

  const handleDeleteSuggestion = (item: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== item));
  };

  // State to manage bulk deletion of templates
  const [isManaging, setIsManaging] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleBulkDeleteSuggestions = () => {
    if (selectedSuggestions.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedSuggestions.length} template bahan yang dipilih?`)) {
      setSuggestions((prev) => prev.filter((s) => !selectedSuggestions.includes(s)));
      setSelectedSuggestions([]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Bahan / Material *</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsManaging(!isManaging);
              setSelectedSuggestions([]);
            }}
            className={`text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg border ${
              isManaging
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
                : "bg-white border-[#EAEAEA] text-zinc-650 hover:bg-[#F5F5F5] dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {isManaging ? "Selesai" : "Kelola Rekomendasi"}
          </button>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Klik rekomendasi untuk memilih</span>
        </div>
      </div>

      {list.length === 0 ? (
        <input type="hidden" name="materials" value="" />
      ) : (
        list.map((m, idx) => <input key={idx} type="hidden" name="materials" value={m} />)
      )}

      {/* Bulk Delete Materials Recommendations */}
      {isManaging && suggestions.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200/40 dark:border-red-900/30 bg-red-50/10 dark:bg-red-950/5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark dark:text-zinc-200">Kelola Template Bahan ({suggestions.length})</span>
            {selectedSuggestions.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDeleteSuggestions}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedSuggestions.length})</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {suggestions.map((item) => {
              const isChecked = selectedSuggestions.includes(item);
              return (
                <label 
                  key={item}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/50"
                      : "bg-white dark:bg-zinc-900 border-[#EAEAEA] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedSuggestions(selectedSuggestions.filter((s) => s !== item));
                      } else {
                        setSelectedSuggestions([...selectedSuggestions, item]);
                      }
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 accent-red-650 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-brand-dark dark:text-zinc-200 truncate">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestion / Recommendations templates with edit delete capability */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20">
        {suggestions.map((mat) => {
          const isSelected = list.includes(mat);
          return (
            <span
              key={mat}
              className={`inline-flex items-center gap-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-zinc-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleMaterial(mat)}
                className="pl-3 pr-2 py-1 text-left"
              >
                {mat}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSuggestion(mat)}
                className="pr-2 pl-1 text-xs text-zinc-400 hover:text-red-500 font-bold transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
                title="Hapus dari rekomendasi"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Bahan lainnya (akan otomatis disimpan ke rekomendasi)..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="p-2.5 bg-brand-dark dark:bg-zinc-200 hover:bg-brand-dark/80 dark:hover:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {list.map((mat) => (
            <span
              key={mat}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
            >
              <span>{mat}</span>
              <button
                type="button"
                onClick={() => setList(list.filter((m) => m !== mat))}
                className="text-brand-gold hover:text-red-500 font-bold ml-0.5 scale-110"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── 4. STRUCTURED FINISHINGS INPUT ───────────────────────
interface FinishingsInputProps {
  initialValues?: string[];
}

export function StructuredFinishingsInput({ initialValues = [""] }: FinishingsInputProps) {
  const [list, setList] = useState<string[]>(initialValues.filter(Boolean));
  const [customInput, setCustomInput] = useState("");

  const fallbackSuggestions = [
    "Natural Walnut (Doff)",
    "Natural Walnut (Glossy)",
    "Melamine Clear Satin",
    "Teak Oil Matte",
    "Duco Black",
    "Duco White",
    "Rustic Wash",
    "Natural NC (Nitrocellulose)"
  ];

  const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("finishing_suggestions");
    if (saved) {
      try {
        setSuggestions(JSON.parse(saved));
      } catch {}
    }
    setSuggestionsLoaded(true);
  }, []);

  useEffect(() => {
    if (suggestionsLoaded && typeof window !== "undefined") {
      localStorage.setItem("finishing_suggestions", JSON.stringify(suggestions));
    }
  }, [suggestions, suggestionsLoaded]);

  const toggleFinishing = (fin: string) => {
    if (list.includes(fin)) {
      setList(list.filter((f) => f !== fin));
    } else {
      setList([...list, fin]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      
      // Auto-save to suggestions templates
      if (!suggestions.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        setSuggestions((prev) => [...prev, trimmed]);
      }
      setCustomInput("");
    }
  };

  const handleDeleteSuggestion = (item: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== item));
  };

  // State to manage bulk deletion of templates
  const [isManaging, setIsManaging] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleBulkDeleteSuggestions = () => {
    if (selectedSuggestions.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedSuggestions.length} template finishing yang dipilih?`)) {
      setSuggestions((prev) => prev.filter((s) => !selectedSuggestions.includes(s)));
      setSelectedSuggestions([]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Sentuhan / Finishing *</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsManaging(!isManaging);
              setSelectedSuggestions([]);
            }}
            className={`text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg border ${
              isManaging
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
                : "bg-white border-[#EAEAEA] text-zinc-650 hover:bg-[#F5F5F5] dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {isManaging ? "Selesai" : "Kelola Rekomendasi"}
          </button>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Klik rekomendasi untuk memilih</span>
        </div>
      </div>

      {list.length === 0 ? (
        <input type="hidden" name="finishings" value="" />
      ) : (
        list.map((f, idx) => <input key={idx} type="hidden" name="finishings" value={f} />)
      )}

      {/* Bulk Delete Finishings Recommendations */}
      {isManaging && suggestions.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200/40 dark:border-red-900/30 bg-red-50/10 dark:bg-red-950/5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark dark:text-zinc-200">Kelola Template Finishing ({suggestions.length})</span>
            {selectedSuggestions.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDeleteSuggestions}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedSuggestions.length})</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {suggestions.map((item) => {
              const isChecked = selectedSuggestions.includes(item);
              return (
                <label 
                  key={item}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/50"
                      : "bg-white dark:bg-zinc-900 border-[#EAEAEA] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedSuggestions(selectedSuggestions.filter((s) => s !== item));
                      } else {
                        setSelectedSuggestions([...selectedSuggestions, item]);
                      }
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 accent-red-650 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-brand-dark dark:text-zinc-200 truncate">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestion / Recommendations templates with edit delete capability */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20">
        {suggestions.map((fin) => {
          const isSelected = list.includes(fin);
          return (
            <span
              key={fin}
              className={`inline-flex items-center gap-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-zinc-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFinishing(fin)}
                className="pl-3 pr-2 py-1 text-left"
              >
                {fin}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSuggestion(fin)}
                className="pr-2 pl-1 text-xs text-zinc-400 hover:text-red-500 font-bold transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
                title="Hapus dari rekomendasi"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Finishing lainnya (akan otomatis disimpan ke rekomendasi)..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="p-2.5 bg-brand-dark dark:bg-zinc-200 hover:bg-brand-dark/80 dark:hover:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {list.map((fin) => (
            <span
              key={fin}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
            >
              <span>{fin}</span>
              <button
                type="button"
                onClick={() => setList(list.filter((f) => f !== fin))}
                className="text-brand-gold hover:text-red-500 font-bold ml-0.5 scale-110"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── 5. STRUCTURED MARKETPLACE LINKS ───────────────────────
const MARKETPLACE_PLATFORMS = [
  { name: "Tokopedia" },
  { name: "Shopee" },
  { name: "WhatsApp" },
  { name: "Instagram" },
  { name: "Lainnya" }
];

const getPlatformStyle = (platformName: string, isSelected: boolean, hasSelected: boolean) => {
  const name = platformName.toLowerCase();
  let baseColorClass = "";
  if (name === "tokopedia") {
    baseColorClass = "border-[#00AA5B] text-[#00AA5B] hover:bg-[#00AA5B]/10";
  } else if (name === "shopee") {
    baseColorClass = "border-[#EE4D2D] text-[#EE4D2D] hover:bg-[#EE4D2D]/10";
  } else if (name === "whatsapp") {
    baseColorClass = "border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10";
  } else if (name === "instagram") {
    baseColorClass = "border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C]/10";
  } else {
    baseColorClass = "border-zinc-400 text-zinc-600 dark:border-zinc-700 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800";
  }

  if (isSelected) {
    if (name === "tokopedia") return "bg-[#00AA5B] text-white border-transparent shadow-md shadow-[#00AA5B]/20 scale-105 opacity-100";
    if (name === "shopee") return "bg-[#EE4D2D] text-white border-transparent shadow-md shadow-[#EE4D2D]/20 scale-105 opacity-100";
    if (name === "whatsapp") return "bg-[#25D366] text-white border-transparent shadow-md shadow-[#25D366]/20 scale-105 opacity-100";
    if (name === "instagram") return "bg-[#E1306C] text-white border-transparent shadow-md shadow-[#E1306C]/20 scale-105 opacity-100";
    return "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm scale-105 opacity-100";
  }

  if (hasSelected) {
    return `${baseColorClass} opacity-30 blur-[0.7px] scale-95 saturate-50 hover:opacity-85 hover:blur-0 hover:saturate-100`;
  }

  return `${baseColorClass} opacity-90`;
};

interface MarketplaceLinksProps {
  initialLinks?: Array<{ platform: string; url: string }>;
}

export function StructuredMarketplaceLinks({ initialLinks = [{ platform: "", url: "" }] }: MarketplaceLinksProps) {
  const [links, setLinks] = useState(() => {
    return initialLinks.length > 0 ? initialLinks : [{ platform: "", url: "" }];
  });

  const addLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const removeLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const updateLink = (idx: number, field: "platform" | "url", value: string) => {
    setLinks(links.map((lnk, i) => (i === idx ? { ...lnk, [field]: value } : lnk)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Marketplace Links</h2>
        <button
          type="button"
          onClick={addLink}
          className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-brand-gold/80"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Link</span>
        </button>
      </div>

      <div className="space-y-3">
        {links.map((lnk, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Link #{idx + 1}</span>
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {MARKETPLACE_PLATFORMS.map((platform) => {
                const isSelected = lnk.platform.toLowerCase() === platform.name.toLowerCase();
                const hasSelected = !!lnk.platform;
                return (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => updateLink(idx, "platform", platform.name)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${getPlatformStyle(platform.name, isSelected, hasSelected)}`}
                  >
                    {platform.name}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="linkPlatform"
                required
                placeholder="Platform (e.g. Tokopedia)"
                value={lnk.platform}
                onChange={(e) => updateLink(idx, "platform", e.target.value)}
                className="w-1/3 px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200"
              />
              <div className="flex-1 relative flex items-center">
                <LinkIcon className="absolute left-3 w-3.5 h-3.5 text-zinc-400 select-none" />
                <input
                  type="url"
                  name="linkUrl"
                  required
                  placeholder="URL link produk (https://...)"
                  value={lnk.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
