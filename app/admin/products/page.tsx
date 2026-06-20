import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { softDeleteProduct, toggleProductStatus } from "@/lib/actions";
import { Plus, Package, Eye, Pencil, Trash2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

import ProductSearch from "@/components/admin/ProductSearch";
import QuickEditButton from "@/components/admin/QuickEditButton";
import LeaderboardClient from "./LeaderboardClient";

const getPrimaryImage = (imagesStr: string) => {
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) && parsed.length > 0 && parsed[0] ? parsed[0] : "/images/hero.jpg";
  } catch {
    return "/images/hero.jpg";
  }
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const status = typeof params.status === 'string' ? params.status : undefined;
  
  // Parse pagination details
  const page = typeof params.page === 'string' ? parseInt(params.page) || 1 : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) || 10 : 10;

  const whereClause: any = { isDeleted: false };
  
  if (status && status !== "ALL") {
    whereClause.status = status;
  }
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  // Optimized parallel queries for products and count
  const [products, totalProducts, allProducts] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      where: whereClause,
      include: { links: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({
      where: whereClause,
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, views: true, images: true },
      orderBy: { views: "desc" }
    })
  ]);

  const totalPages = Math.ceil(totalProducts / limit);
  const activePage = Math.min(page, totalPages || 1);
  const startIndex = (activePage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalProducts);

  const getPageUrl = (targetPage: number, targetLimit?: number) => {
    const paramsObj = new URLSearchParams();
    if (search) paramsObj.set("search", search);
    if (status && status !== "ALL") paramsObj.set("status", status);
    paramsObj.set("page", targetPage.toString());
    paramsObj.set("limit", (targetLimit || limit).toString());
    return `/admin/products?${paramsObj.toString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100">Products Catalog</h1>
          <p className="text-brand-dark dark:text-brand-light text-sm mt-1">Manage your store's inventory</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/new"
            className="flex shrink-0 items-center justify-center gap-2 px-6 py-3 sm:py-2 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all hover:shadow-md w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Products Table */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-4 sm:p-6 border-b border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/50">
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 mb-4 sm:mb-0 hidden sm:block">All Products</h2>
            <ProductSearch />
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white dark:bg-zinc-900 text-xs text-brand-dark dark:text-brand-light border-b border-[#EAEAEA] dark:border-zinc-800 uppercase tracking-wider">
                  <th className="p-4 font-semibold pl-6">Product</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-brand-dark dark:text-brand-light">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Package className="w-8 h-8 opacity-20" />
                        <p>No products found. Add one to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr key={product.id} className="border-b border-[#EAEAEA]/50 dark:border-zinc-800/50 last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4 pl-6 flex items-center gap-4">
                        <div className="relative h-12 w-12 sm:h-10 sm:w-10 shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-800">
                          <Image src={getPrimaryImage(product.images)} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="max-w-[150px] sm:max-w-xs overflow-hidden">
                          <div className="font-semibold text-brand-dark dark:text-zinc-100 truncate" title={product.name}>{product.name}</div>
                          <div className="text-xs text-brand-dark dark:text-brand-light truncate">{product.category}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <form action={toggleProductStatus.bind(null, product.id)}>
                          <button
                            type="submit"
                            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-2.5 sm:py-1 text-xs sm:text-[11px] font-semibold rounded-full transition-all ${
                              product.status === "PUBLISHED"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 sm:h-1.5 sm:w-1.5 shrink-0 rounded-full ${product.status === "PUBLISHED" ? "bg-emerald-500 animate-pulse" : "bg-gray-400 dark:bg-zinc-500"}`} />
                            {product.status}
                          </button>
                        </form>
                      </td>
                      <td className="p-4 font-semibold text-brand-dark dark:text-brand-light">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${product.stock <= 5 ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-400/20" : "bg-gray-50 dark:bg-zinc-800 text-brand-dark dark:text-brand-light ring-1 ring-inset ring-gray-500/10 dark:ring-zinc-500/20"}`}>
                          {product.stock} left
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <QuickEditButton product={{ id: product.id, name: product.name, price: product.price, stock: product.stock }} />
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="inline-flex p-2.5 sm:p-2 text-brand-dark dark:text-brand-light hover:text-brand-dark dark:hover:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-[#EAEAEA] dark:hover:border-zinc-700"
                          title="Quick View Frontend"
                        >
                          <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
                        </Link>
                        <Link
                          href={`/admin/edit/${product.id}`}
                          className="inline-flex p-2.5 sm:p-2 text-brand-dark dark:text-brand-light hover:text-brand-dark dark:hover:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-[#EAEAEA] dark:hover:border-zinc-700"
                          title="Edit Product"
                        >
                          <Pencil className="w-5 h-5 sm:w-4 sm:h-4" />
                        </Link>
                        <form
                          action={softDeleteProduct.bind(null, product.id)}
                          className="inline-block"
                        >
                          <button
                            type="submit"
                            className="inline-flex p-2.5 sm:p-2 text-brand-dark dark:text-brand-light hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block sm:hidden divide-y divide-[#EAEAEA] dark:divide-zinc-800">
            {products.length === 0 ? (
              <div className="p-8 text-center text-brand-dark dark:text-brand-light">
                <Package className="w-8 h-8 opacity-20 mx-auto mb-2" />
                <p>No products found. Add one to get started.</p>
              </div>
            ) : (
              products.map((product: any) => (
                <div key={product.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-800">
                      <Image src={getPrimaryImage(product.images)} alt={product.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-brand-dark dark:text-zinc-100 break-words leading-tight">{product.name}</h4>
                      <p className="text-xs text-brand-dark/60 dark:text-zinc-400 mt-1">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-brand-dark/50 dark:text-zinc-500 font-bold uppercase tracking-wider">Harga & Stock</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-dark dark:text-zinc-100">Rp {product.price.toLocaleString("id-ID")}</span>
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${product.stock <= 5 ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/20" : "bg-gray-50 dark:bg-zinc-800 text-brand-dark dark:text-brand-light ring-1 ring-inset ring-gray-500/10"}`}>
                          {product.stock} left
                        </span>
                      </div>
                    </div>

                    <form action={toggleProductStatus.bind(null, product.id)}>
                      <button
                        type="submit"
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                          product.status === "PUBLISHED"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${product.status === "PUBLISHED" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {product.status}
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-dashed border-[#EAEAEA] dark:border-zinc-850">
                    <QuickEditButton product={{ id: product.id, name: product.name, price: product.price, stock: product.stock }} />
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="inline-flex p-2 text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-lg border border-[#EAEAEA] dark:border-zinc-800"
                      title="Quick View Frontend"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/edit/${product.id}`}
                      className="inline-flex p-2 text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-lg border border-[#EAEAEA] dark:border-zinc-800"
                      title="Edit Product"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={softDeleteProduct.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="inline-flex p-2 text-red-650 hover:bg-red-55 dark:hover:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-950"
                        title="Move to Trash"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Pagination Footer */}
          {totalProducts > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/30 dark:bg-zinc-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-brand-dark dark:text-brand-light">
                <span>
                  Menampilkan {startIndex + 1}-{endIndex} dari {totalProducts} produk
                </span>
                
                {/* Size Selector */}
                <div className="flex items-center gap-2">
                  <span>Baris per halaman:</span>
                  <div className="flex gap-1">
                    {[10, 25, 50].map((size) => (
                      <Link
                        key={size}
                        href={getPageUrl(1, size)}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-bold ${
                          limit === size
                            ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 text-brand-dark dark:text-zinc-300"
                        }`}
                      >
                        {size}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page Buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <Link
                    href={getPageUrl(Math.max(1, activePage - 1))}
                    className={`p-2 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${activePage === 1 ? "pointer-events-none opacity-40" : ""}`}
                  >
                    <ChevronLeft className="w-4 h-4 dark:text-zinc-100" />
                  </Link>

                  <div className="flex items-center gap-1 text-xs font-semibold">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={getPageUrl(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            activePage === pageNum
                              ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={getPageUrl(Math.min(totalPages, activePage + 1))}
                    className={`p-2 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${activePage === totalPages ? "pointer-events-none opacity-40" : ""}`}
                  >
                    <ChevronRight className="w-4 h-4 dark:text-zinc-100" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Products Leaderboard client panel */}
        <div className="xl:col-span-1">
          <LeaderboardClient products={allProducts} />
        </div>
      </div>
    </div>
  );
}
