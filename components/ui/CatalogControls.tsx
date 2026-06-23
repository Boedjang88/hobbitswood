"use client";

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

  return (
    <div className="flex justify-center w-full py-1">
      {/* Responsive Wrapper Card (Vertical on mobile, Horizontal on desktop) */}
      <div className="w-full max-w-[280px] sm:max-w-none sm:w-auto bg-brand-cream/20 dark:bg-zinc-900/20 border-0 rounded-2xl sm:rounded-full p-4 sm:py-3 sm:px-6 flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-xs">
        
        {/* Category Dropdown */}
        <div className="relative group w-full sm:w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Tag className="h-3.5 w-3.5 text-brand-gold shrink-0" />
          </div>
          <select
            value={category || ""}
            onChange={(e) => router.push(buildUrl(e.target.value, undefined, undefined))}
            className="w-full appearance-none bg-white dark:bg-zinc-950/60 border-0 rounded-full py-2.5 pl-10 pr-10 text-center font-serif text-base sm:text-lg font-medium text-brand-dark dark:text-white focus:outline-none cursor-pointer transition-colors hover:bg-white/95 dark:hover:bg-zinc-900/80"
          >
            <option value="" className="bg-white dark:bg-zinc-950 text-brand-dark dark:text-white text-center">
              Kategori: Semua
            </option>
            {categories.map((cat) => (
              <option 
                key={cat.category} 
                value={cat.category}
                className="bg-white dark:bg-zinc-950 text-brand-dark dark:text-white text-center"
              >
                Kategori: {cat.category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <ChevronDown className="h-3.5 w-3.5 text-brand-gold group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Material Dropdown */}
        <div className="relative group w-full sm:w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Compass className="h-3.5 w-3.5 text-brand-gold shrink-0" />
          </div>
          <select
            value={material || ""}
            onChange={(e) => router.push(buildUrl(undefined, undefined, e.target.value))}
            className="w-full appearance-none bg-white dark:bg-zinc-950/60 border-0 rounded-full py-2.5 pl-10 pr-10 text-center font-serif text-base sm:text-lg font-medium text-brand-dark dark:text-white focus:outline-none cursor-pointer transition-colors hover:bg-white/95 dark:hover:bg-zinc-900/80"
          >
            <option value="" className="bg-white dark:bg-zinc-950 text-brand-dark dark:text-white text-center">
              Material: Semua
            </option>
            {materials.map((m) => (
              <option 
                key={m.value} 
                value={m.value}
                className="bg-white dark:bg-zinc-950 text-brand-dark dark:text-white text-center"
              >
                Material: {m.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <ChevronDown className="h-3.5 w-3.5 text-brand-gold group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative group w-full sm:w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <ArrowUpDown className="h-3.5 w-3.5 text-brand-gold shrink-0" />
          </div>
          <select
            value={currentSort}
            onChange={(e) => router.push(buildUrl(undefined, e.target.value, undefined))}
            className="w-full appearance-none bg-white dark:bg-zinc-950/60 border-0 rounded-full py-2.5 pl-10 pr-10 text-center font-serif text-base sm:text-lg font-medium text-brand-dark dark:text-white focus:outline-none cursor-pointer transition-colors hover:bg-white/95 dark:hover:bg-zinc-900/80"
          >
            {sortOptions.map((s) => (
              <option 
                key={s.value} 
                value={s.value}
                className="bg-white dark:bg-zinc-950 text-brand-dark dark:text-white text-center"
              >
                Urutkan: {s.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <ChevronDown className="h-3.5 w-3.5 text-brand-gold group-hover:scale-105 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
}
