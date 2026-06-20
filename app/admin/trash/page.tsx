import { prisma } from "@/lib/prisma";
import { restoreProduct, permanentlyDeleteProduct } from "@/lib/actions";
import { Trash2, RotateCcw, AlertOctagon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const getPrimaryImage = (imagesStr: string) => {
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) && parsed.length > 0 && parsed[0] ? parsed[0] : "/images/hero.jpg";
  } catch {
    return "/images/hero.jpg";
  }
};

export default async function TrashPage() {
  const deletedProducts = await prisma.product.findMany({
    where: { isDeleted: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl transition-colors">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100">Trash Bin</h1>
            <p className="text-brand-dark dark:text-brand-light text-sm mt-1">Manage deleted products. Items here can be restored or permanently removed.</p>
          </div>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-[#F5F5F5] dark:bg-zinc-800 text-brand-dark dark:text-zinc-100 text-sm font-medium rounded-xl hover:bg-[#EAEAEA] dark:hover:bg-zinc-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      {deletedProducts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-12 text-center rounded-2xl border border-dashed border-[#EAEAEA] dark:border-zinc-700 transition-colors">
          <div className="w-16 h-16 bg-[#F5F5F5] dark:bg-zinc-800 text-[#CCC] dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-brand-dark dark:text-zinc-100 text-lg font-medium">Trash is empty</p>
          <p className="text-brand-dark dark:text-brand-light mt-1">No products have been deleted recently.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white dark:bg-zinc-900 text-xs text-brand-dark dark:text-brand-light border-b border-[#EAEAEA] dark:border-zinc-800 uppercase tracking-wider">
                <th className="p-4 font-semibold pl-6">Product</th>
                <th className="p-4 font-semibold">Deleted At</th>
                <th className="p-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {deletedProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#EAEAEA]/50 dark:border-zinc-800/50 last:border-0 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700 bg-[#F5F5F5] dark:bg-zinc-800 shrink-0">
                      <Image src={getPrimaryImage((product as any).images)} alt={product.name} fill className="object-cover opacity-50 grayscale" unoptimized />
                    </div>
                    <div>
                      <div className="font-medium text-brand-dark dark:text-zinc-100 line-through decoration-[#999] dark:decoration-zinc-500">{product.name}</div>
                      <div className="text-xs text-brand-dark dark:text-brand-light">{product.category}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-brand-dark dark:text-brand-light">
                    {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <form action={restoreProduct.bind(null, product.id)} className="inline-block mr-2">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </button>
                    </form>
                    <form action={permanentlyDeleteProduct.bind(null, product.id)} className="inline-block">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                        title="Permanent Delete"
                      >
                        <AlertOctagon className="w-4 h-4" />
                        Destroy
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
