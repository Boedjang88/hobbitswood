"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Tag, Compass, ArrowUpDown } from "lucide-react";

interface Props {
  currentSort: string;
  category?: string;
  material?: string;
  q?: string;
  categories: { category: string }[];
}

export default function CatalogControls({ currentSort, category, material, q, categories }: Props) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const buildUrl = (newCategory?: string, newSort?: string, newMaterial?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    
    const finalCategory = newCategory !== undefined ? newCategory : category;
    if (finalCategory) params.set("category", finalCategory);

    const finalSort = newSort !== undefined ? newSort : currentSort;
    if (finalSort) params.set("sort", finalSort);

    const finalMaterial = newMaterial !== undefined ? newMaterial : material;
    if (finalMaterial) params.set("material", finalMaterial);

    return `/shop?${params.toString()}`;
  };

  const materials = [
    { value: "Jati", label: "Jati" },
    { value: "Mahoni", label: "Mahoni" },
    { value: "Sungkai", label: "Sungkai" },
    { value: "Besi", label: "Besi" },
    { value: "Kain", label: "Kain" },
  ];

  const sortOptions = [
    { value: "newest", label: "Terbaru" },
    { value: "popular", label: "Terpopuler" },
    { value: "price_asc", label: "Harga Terendah" },
    { value: "price_desc", label: "Harga Tertinggi" },
  ];

  const currentCategoryLabel = categories.find((c) => c.category === category)?.category || "Semua";
  const currentMaterialLabel = materials.find((m) => m.value.toLowerCase() === (material || "").toLowerCase())?.label || "Semua";
  const currentSortLabel = sortOptions.find((s) => s.value === currentSort)?.label || "Terbaru";

  return (
    <div className="flex justify-center w-full py-1">
      {/* Responsive Accordion Wrapper (Vertical cards on mobile, Horizontal cards on desktop) */}
      <div className="w-full max-w-[280px] sm:max-w-none sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center sm:items-start">
        
        {/* Category Accordion Box */}
        <div className="w-full sm:w-[230px] bg-brand-cream/10 dark:bg-zinc-900/10 border border-brand-wood/10 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all">
          <button
            type="button"
            onClick={() => toggleSection("category")}
            className="relative flex items-center justify-between w-full py-3.5 px-4 bg-transparent text-center font-serif text-base font-semibold text-brand-dark dark:text-white cursor-pointer hover:bg-brand-cream/15 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <Tag className="h-4 w-4 text-brand-gold shrink-0" />
            <span className="flex-1 text-center select-none pl-2 pr-2 text-sm sm:text-base">
              Kategori: {currentCategoryLabel}
            </span>
            <ChevronDown className={`h-4 w-4 text-brand-gold shrink-0 transition-transform duration-300 ${
              openSection === "category" ? "rotate-180" : "rotate-0"
            }`} />
          </button>
          
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "category" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-1 py-3 bg-brand-cream/15 dark:bg-black/10 border-t border-brand-wood/5 dark:border-zinc-800/30">
                <button
                  type="button"
                  onClick={() => {
                    router.push(buildUrl("", undefined, undefined));
                    setOpenSection(null);
                  }}
                  className={`w-full py-2.5 text-center font-serif text-sm sm:text-base transition-colors cursor-pointer ${
                    !category 
                      ? "text-brand-gold font-bold" 
                      : "text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-gold"
                  }`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => {
                  const isActive = category === cat.category;
                  return (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => {
                        router.push(buildUrl(cat.category, undefined, undefined));
                        setOpenSection(null);
                      }}
                      className={`w-full py-2.5 text-center font-serif text-sm sm:text-base transition-colors cursor-pointer ${
                        isActive 
                          ? "text-brand-gold font-bold" 
                          : "text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-gold"
                      }`}
                    >
                      {cat.category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Material Accordion Box */}
        <div className="w-full sm:w-[230px] bg-brand-cream/10 dark:bg-zinc-900/10 border border-brand-wood/10 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all">
          <button
            type="button"
            onClick={() => toggleSection("material")}
            className="relative flex items-center justify-between w-full py-3.5 px-4 bg-transparent text-center font-serif text-base font-semibold text-brand-dark dark:text-white cursor-pointer hover:bg-brand-cream/15 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <Compass className="h-4 w-4 text-brand-gold shrink-0" />
            <span className="flex-1 text-center select-none pl-2 pr-2 text-sm sm:text-base">
              Material: {currentMaterialLabel}
            </span>
            <ChevronDown className={`h-4 w-4 text-brand-gold shrink-0 transition-transform duration-300 ${
              openSection === "material" ? "rotate-180" : "rotate-0"
            }`} />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "material" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-1 py-3 bg-brand-cream/15 dark:bg-black/10 border-t border-brand-wood/5 dark:border-zinc-800/30">
                <button
                  type="button"
                  onClick={() => {
                    router.push(buildUrl(undefined, undefined, ""));
                    setOpenSection(null);
                  }}
                  className={`w-full py-2.5 text-center font-serif text-sm sm:text-base transition-colors cursor-pointer ${
                    !material 
                      ? "text-brand-gold font-bold" 
                      : "text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-gold"
                  }`}
                >
                  Semua Material
                </button>
                {materials.map((m) => {
                  const isActive = (material || "").toLowerCase() === m.value.toLowerCase();
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => {
                        router.push(buildUrl(undefined, undefined, m.value));
                        setOpenSection(null);
                      }}
                      className={`w-full py-2.5 text-center font-serif text-sm sm:text-base transition-colors cursor-pointer ${
                        isActive 
                          ? "text-brand-gold font-bold" 
                          : "text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-gold"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sort Accordion Box */}
        <div className="w-full sm:w-[230px] bg-brand-cream/10 dark:bg-zinc-900/10 border border-brand-wood/10 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all">
          <button
            type="button"
            onClick={() => toggleSection("sort")}
            className="relative flex items-center justify-between w-full py-3.5 px-4 bg-transparent text-center font-serif text-base font-semibold text-brand-dark dark:text-white cursor-pointer hover:bg-brand-cream/15 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4 text-brand-gold shrink-0" />
            <span className="flex-1 text-center select-none pl-2 pr-2 text-sm sm:text-base">
              Urutkan: {currentSortLabel}
            </span>
            <ChevronDown className={`h-4 w-4 text-brand-gold shrink-0 transition-transform duration-300 ${
              openSection === "sort" ? "rotate-180" : "rotate-0"
            }`} />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "sort" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-1 py-3 bg-brand-cream/15 dark:bg-black/10 border-t border-brand-wood/5 dark:border-zinc-800/30">
                {sortOptions.map((s) => {
                  const isActive = currentSort === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => {
                        router.push(buildUrl(undefined, s.value, undefined));
                        setOpenSection(null);
                      }}
                      className={`w-full py-2.5 text-center font-serif text-sm sm:text-base transition-colors cursor-pointer ${
                        isActive 
                          ? "text-brand-gold font-bold" 
                          : "text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-gold"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
