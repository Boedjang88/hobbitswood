"use client";

import { useRouter } from "next/navigation";

export default function SortSelect({ currentSort, category }: { currentSort: string, category?: string }) {
  const router = useRouter();

  const buildUrl = (newSort: string) => {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    params.set("sort", newSort);
    return `/shop?${params.toString()}`;
  };

  return (
    <select 
      name="sort"
      defaultValue={currentSort}
      onChange={(e) => {
        router.push(buildUrl(e.target.value));
      }}
      className="bg-transparent border-b border-brand-wood/30 dark:border-brand-light/30 text-brand-dark dark:text-brand-light text-sm py-1 px-2 focus:outline-none focus:border-brand-gold cursor-pointer"
    >
      <option value="newest" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Terbaru</option>
      <option value="popular" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Terpopuler</option>
      <option value="price_asc" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Harga Terendah</option>
      <option value="price_desc" className="bg-brand-light text-brand-dark dark:bg-[#222] dark:text-brand-light">Harga Tertinggi</option>
    </select>
  );
}
