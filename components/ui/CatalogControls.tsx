"use client";

import { useRouter } from "next/navigation";

interface Props {
  currentSort: string;
  category?: string;
  material?: string;
}

export default function CatalogControls({ currentSort, category, material }: Props) {
  const router = useRouter();

  const buildUrl = (newSort?: string, newMaterial?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    
    const finalSort = newSort !== undefined ? newSort : currentSort;
    if (finalSort) params.set("sort", finalSort);
    
    const finalMaterial = newMaterial !== undefined ? newMaterial : material;
    if (finalMaterial) params.set("material", finalMaterial);

    return `/shop?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
      <div className="flex items-center gap-2">
        <span className="text-xs text-brand-dark font-medium dark:text-brand-light uppercase tracking-wider">Material:</span>
        <select 
          value={material || ""}
          onChange={(e) => router.push(buildUrl(undefined, e.target.value))}
          className="bg-transparent border-b border-brand-wood/30 dark:border-brand-light/30 text-brand-dark dark:text-brand-light text-sm py-1 px-2 focus:outline-none focus:border-brand-gold cursor-pointer"
        >
          <option value="" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Semua</option>
          <option value="Jati" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Jati</option>
          <option value="Mahoni" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Mahoni</option>
          <option value="Sungkai" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Sungkai</option>
          <option value="Besi" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Besi</option>
          <option value="Kain" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Kain</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-brand-dark font-medium dark:text-brand-light uppercase tracking-wider">Urutkan:</span>
        <select 
          value={currentSort}
          onChange={(e) => router.push(buildUrl(e.target.value, undefined))}
          className="bg-transparent border-b border-brand-wood/30 dark:border-brand-light/30 text-brand-dark dark:text-brand-light text-sm py-1 px-2 focus:outline-none focus:border-brand-gold cursor-pointer"
        >
          <option value="newest" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Terbaru</option>
          <option value="popular" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Terpopuler</option>
          <option value="price_asc" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Harga Terendah</option>
          <option value="price_desc" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Harga Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
