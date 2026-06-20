"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Link as LinkIcon, RefreshCw } from "lucide-react";

// ─── 1. SLUG GENERATOR ────────────────────────────────────
interface SlugGeneratorProps {
  productName: string;
  initialValue?: string;
}

export function SlugGenerator({ productName, initialValue = "" }: SlugGeneratorProps) {
  const [slug, setSlug] = useState(initialValue);
  const [isManual, setIsManual] = useState(!!initialValue);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  useEffect(() => {
    if (!isManual) {
      setSlug(slugify(productName));
    }
  }, [productName, isManual]);

  return (
    <div className="relative">
      <label htmlFor="slug" className="mb-2 block text-sm font-medium text-brand-dark dark:text-zinc-100 flex items-center justify-between">
        <span>URL Slug (SEO) *</span>
        <button
          type="button"
          onClick={() => {
            setIsManual(false);
            setSlug(slugify(productName));
          }}
          className={`text-xs font-semibold flex items-center gap-1 transition-all ${
            isManual 
              ? "text-brand-gold hover:text-brand-gold/80" 
              : "text-zinc-400 dark:text-zinc-650 cursor-default"
          }`}
          disabled={!isManual}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${!isManual ? "" : "animate-spin-once"}`} />
          <span>Reset ke Otomatis</span>
        </button>
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-xs font-medium text-zinc-400 select-none">/product/</span>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setIsManual(true);
            const val = e.target.value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            setSlug(val);
          }}
          onBlur={() => {
            const cleaned = slug
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");
            setSlug(cleaned);
          }}
          placeholder="nama-produk-otomatis"
          className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-18 pr-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600 font-mono"
        />
      </div>
    </div>
  );
}


// ─── 2. STRUCTURED DIMENSIONS INPUT ───────────────────────
const DIMENSION_PRESETS = [
  { label: "Kursi Standar", l: 45, w: 45, h: 90, manual: "" },
  { label: "Meja Makan M", l: 120, w: 80, h: 75, manual: "" },
  { label: "Meja Makan L", l: 180, w: 90, h: 75, manual: "" },
  { label: "Meja Kopi", l: 60, w: 60, h: 45, manual: "" },
  { label: "Lemari Buku", l: 100, w: 40, h: 180, manual: "" },
  { label: "Tempat Tidur M", l: 160, w: 200, h: 35, manual: "" },
  { label: "Bulat (D:80 T:75)", l: 0, w: 0, h: 0, manual: "Diameter 80 cm, Tinggi 75 cm" }
];

interface DimensionsInputProps {
  initialValues?: string[];
}

export function StructuredDimensionsInput({ initialValues = [""] }: DimensionsInputProps) {
  const [items, setItems] = useState<Array<{ id: number; mode: "structured" | "manual"; l: string; w: string; h: string; unit: string; customText: string }>>(() => {
    return initialValues.map((val, idx) => {
      const match = val.match(/^(\d+)x(\d+)x(\d+)\s*(cm|mm|m)$/i);
      if (match) {
        return {
          id: idx,
          mode: "structured" as const,
          l: match[1],
          w: match[2],
          h: match[3],
          unit: match[4],
          customText: ""
        };
      }
      return {
        id: idx,
        mode: "manual" as const,
        l: "",
        w: "",
        h: "",
        unit: "cm",
        customText: val
      };
    });
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), mode: "structured", l: "", w: "", h: "", unit: "cm", customText: "" }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, fields: Partial<(typeof items)[0]>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...fields } : item)));
  };

  const applyPreset = (id: number, preset: typeof DIMENSION_PRESETS[0]) => {
    if (preset.manual) {
      updateItem(id, {
        mode: "manual",
        customText: preset.manual
      });
    } else {
      updateItem(id, {
        mode: "structured",
        l: String(preset.l),
        w: String(preset.w),
        h: String(preset.h),
        unit: "cm"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Ukuran/Dimensi *</label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-brand-gold/80"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ukuran</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const finalValue =
            item.mode === "structured"
              ? item.l && item.w && item.h
                ? `${item.l}x${item.w}x${item.h} ${item.unit}`
                : ""
              : item.customText;

          return (
            <div key={item.id} className="relative p-4 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20 space-y-3">
              <input type="hidden" name="dimensions" value={finalValue} />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-brand-dark/40 dark:text-zinc-500 uppercase tracking-wider">Dimensi #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { mode: "structured" })}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      item.mode === "structured"
                        ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900"
                        : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Terstruktur
                  </button>
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { mode: "manual" })}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      item.mode === "manual"
                        ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900"
                        : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Bebas
                  </button>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {item.mode === "structured" ? (
                <div className="grid grid-cols-4 gap-2 items-center">
                  <div>
                    <input
                      type="number"
                      placeholder="P"
                      required
                      value={item.l}
                      onChange={(e) => updateItem(item.id, { l: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="L"
                      required
                      value={item.w}
                      onChange={(e) => updateItem(item.id, { w: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="T"
                      required
                      value={item.h}
                      onChange={(e) => updateItem(item.id, { h: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 font-semibold"
                    >
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="e.g. Diameter 80 cm, Tinggi 75 cm"
                    required
                    value={item.customText}
                    onChange={(e) => updateItem(item.id, { customText: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mr-1">Rekomendasi:</span>
                {DIMENSION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(item.id, preset)}
                    className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-brand-dark dark:text-zinc-300 transition-colors"
                  >
                    {preset.label}
                  </button>
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
const MATERIAL_SUGGESTIONS = [
  "Kayu Jati Solid",
  "Kayu Mahoni",
  "Kayu Mindi",
  "Besi Hollow",
  "Stainless Steel",
  "Rattan Alami",
  "Kain Linen Premium",
  "Busa High Density"
];

interface MaterialsInputProps {
  initialValues?: string[];
}

export function StructuredMaterialsInput({ initialValues = [""] }: MaterialsInputProps) {
  const [list, setList] = useState<string[]>(initialValues.filter(Boolean));
  const [customInput, setCustomInput] = useState("");

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
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Bahan / Material *</label>

      {list.length === 0 ? (
        <input type="hidden" name="materials" value="" />
      ) : (
        list.map((m, idx) => <input key={idx} type="hidden" name="materials" value={m} />)
      )}

      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20">
        {MATERIAL_SUGGESTIONS.map((mat) => {
          const isSelected = list.includes(mat);
          return (
            <button
              key={mat}
              type="button"
              onClick={() => toggleMaterial(mat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-xs"
                  : "bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {mat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Bahan lainnya..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="p-2 bg-brand-dark dark:bg-zinc-200 hover:bg-brand-dark/80 dark:hover:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 transition-colors shrink-0"
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
const FINISHING_SUGGESTIONS = [
  "Natural Walnut (Doff)",
  "Natural Walnut (Glossy)",
  "Melamine Clear Satin",
  "Teak Oil Matte",
  "Duco Black",
  "Duco White",
  "Rustic Wash",
  "Natural NC (Nitrocellulose)"
];

interface FinishingsInputProps {
  initialValues?: string[];
}

export function StructuredFinishingsInput({ initialValues = [""] }: FinishingsInputProps) {
  const [list, setList] = useState<string[]>(initialValues.filter(Boolean));
  const [customInput, setCustomInput] = useState("");

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
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Sentuhan / Finishing *</label>

      {list.length === 0 ? (
        <input type="hidden" name="finishings" value="" />
      ) : (
        list.map((f, idx) => <input key={idx} type="hidden" name="finishings" value={f} />)
      )}

      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/20">
        {FINISHING_SUGGESTIONS.map((fin) => {
          const isSelected = list.includes(fin);
          return (
            <button
              key={fin}
              type="button"
              onClick={() => toggleFinishing(fin)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-xs"
                  : "bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 text-brand-dark dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {fin}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Finishing lainnya..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs outline-none text-brand-dark dark:text-zinc-200 focus:border-brand-gold/50"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="p-2 bg-brand-dark dark:bg-zinc-200 hover:bg-brand-dark/80 dark:hover:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 transition-colors shrink-0"
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
  { name: "Tokopedia", color: "bg-[#42B549]/10 text-[#42B549] border-[#42B549]/20 hover:bg-[#42B549]/20" },
  { name: "Shopee", color: "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/20 hover:bg-[#EE4D2D]/20" },
  { name: "WhatsApp", color: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/20" },
  { name: "Instagram", color: "bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20 hover:bg-[#E1306C]/20" },
  { name: "Lainnya", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-[#EAEAEA] dark:border-zinc-700 hover:bg-zinc-200" }
];

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
                return (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => updateLink(idx, "platform", platform.name)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-brand-dark text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent shadow-xs"
                        : platform.color
                    }`}
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
