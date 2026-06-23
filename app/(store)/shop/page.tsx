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
      <section className="pt-28 md:pt-36 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Compact Header & Search */}
          <div className="mb-6 lg:mb-8">
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
          <div className="mb-4 flex justify-center w-full">
            <CatalogControls 
              currentSort={sort} 
              category={category} 
              material={material} 
              q={q}
              categories={categories} 
            />
          </div>


          {/* Product grid */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
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
