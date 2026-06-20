"use client";

import { useState } from "react";
import { Zap, X, Loader2 } from "lucide-react";
import { quickEditProduct } from "@/lib/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickEditButton({ product }: { product: { id: string; name: string; price: number; stock: number } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  const handleSave = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menyimpan perubahan harga & stok untuk "${product.name}"?`)) {
      return;
    }
    setIsSaving(true);
    const result = await quickEditProduct(product.id, price, stock);
    setIsSaving(false);
    
    if (result.success) {
      toast.success(`${product.name} updated successfully!`);
      setIsOpen(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex p-2.5 sm:p-2 text-brand-dark dark:text-brand-light hover:text-brand-dark dark:hover:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-[#EAEAEA] dark:hover:border-zinc-700"
        title="Quick Edit (Stock & Price)"
      >
        <Zap className="w-5 h-5 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-zinc-800 p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-dark dark:text-zinc-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Edit
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-brand-dark dark:text-zinc-100 truncate">{product.name}</p>
                <p className="text-xs text-brand-dark/60 dark:text-zinc-400">Update stock or price directly.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark dark:text-brand-light mb-1 uppercase tracking-wider">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-[#111] dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark dark:text-brand-light mb-1 uppercase tracking-wider">Price (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-[#111] dark:focus:ring-zinc-100 focus:border-transparent outline-none transition-all dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-brand-dark dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
