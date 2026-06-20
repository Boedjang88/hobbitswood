import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import SearchInput from "@/components/ui/SearchInput";
import { redirect } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";
import SortSelect from "@/components/ui/SortSelect";
import CatalogControls from "@/components/ui/CatalogControls";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Katalog — Hobbits Wood",
  description:
    "Jelajahi koleksi furniture kayu solid buatan tangan dari pengrajin Bekasi. Kursi, meja, dan lemari premium.",
};

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const material = typeof searchParams.material === "string" ? searchParams.material : undefined;

  const whereClause: any = { isDeleted: false, status: "PUBLISHED" };
  if (q) {
    whereClause.name = { contains: q, mode: "insensitive" };
  }
  if (category) {
    whereClause.category = category;
  }
  if (material) {
    whereClause.materials = { contains: material, mode: "insensitive" };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { views: "desc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy,
  });

  const categories = await prisma.product.findMany({
    where: { isDeleted: false, status: "PUBLISHED" },
    select: { category: true },
    distinct: ["category"],
  });

  const buildUrl = (newCategory?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (newCategory !== undefined) {
      if (newCategory !== "") params.set("category", newCategory);
    } else if (category) {
      params.set("category", category);
    }
    
    if (material) params.set("material", material);
    if (sort) params.set("sort", sort);
    
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="page-enter bg-brand-light dark:bg-[#1A1A1A] min-h-screen transition-colors duration-300">
      {/* Categories & Products */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Compact Header & Search */}
          <div className="mb-10 lg:mb-12">
            <AnimateOnScroll direction="up" className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h1 className="font-serif text-3xl sm:text-4xl tracking-wide text-brand-dark dark:text-brand-light">
                  Katalog Produk
                </h1>
                <p className="mt-2 text-sm text-brand-dark/70 dark:text-brand-light/70 max-w-md">
                  Koleksi furniture kayu solid premium.
                </p>
              </div>
              <div className="w-full md:w-auto max-w-md flex-1">
                <SearchInput />
              </div>
            </AnimateOnScroll>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col gap-4 mb-10 bg-white dark:bg-[#222] p-3 sm:p-4 rounded-lg shadow-sm border border-brand-wood/10 dark:border-brand-light/10">
            {/* Category filter pills */}
            <div className="flex overflow-x-auto items-center gap-2 pb-1 scrollbar-none snap-x -mx-1 px-1">
              <Link
                href={buildUrl("")}
                className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-all duration-300 whitespace-nowrap shrink-0 snap-start ${
                  !category
                    ? "bg-brand-dark text-brand-light dark:bg-brand-light dark:text-brand-dark"
                    : "border border-brand-wood/20 text-brand-dark dark:text-brand-light hover:border-brand-wood dark:hover:border-brand-light"
                }`}
              >
                Semua
              </Link>
              {categories.map((cat: { category: string }) => (
                <Link
                  key={cat.category}
                  href={buildUrl(cat.category)}
                  className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-all duration-300 whitespace-nowrap shrink-0 snap-start ${
                    category === cat.category
                      ? "bg-brand-dark text-brand-light dark:bg-brand-light dark:text-brand-dark"
                      : "border border-brand-wood/20 text-brand-dark dark:text-brand-light hover:border-brand-wood dark:hover:border-brand-light"
                  }`}
                >
                  {cat.category}
                </Link>
              ))}
            </div>

            <div className="border-t border-brand-wood/5 dark:border-brand-light/5 pt-3">
              <CatalogControls currentSort={sort} category={category} material={material} />
            </div>
          </div>


          {/* Product grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
            {products.map((product: import('@prisma/client').Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty state info */}
          {products.length === 0 && (
            <div className="mt-16 rounded-sm border border-dashed border-brand-wood/20 bg-brand-cream/50 p-10 text-center dark:bg-[#222]">
              <p className="font-serif text-lg text-brand-dark dark:text-brand-light">
                Produk Tidak Ditemukan
              </p>
              <p className="mt-2 text-sm text-brand-dark font-medium dark:text-brand-light">
                Silakan coba kata kunci lain atau hapus filter kategori.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
