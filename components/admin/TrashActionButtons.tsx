"use client";

import { useState } from "react";
import { RotateCcw, AlertOctagon, Loader2 } from "lucide-react";
import { restoreProduct, permanentlyDeleteProduct } from "@/lib/actions";
import { toast } from "sonner";

export function RestoreProductButton({ 
  productId, 
  productName 
}: { 
  productId: string; 
  productName: string; 
}) {
  const [isPending, setIsPending] = useState(false);

  const handleRestore = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin memulihkan produk "${productName}"?`)) {
      return;
    }

    setIsPending(true);
    try {
      await restoreProduct(productId);
      toast.success(`Produk "${productName}" berhasil dipulihkan!`, {
        icon: "🔄"
      });
    } catch (err) {
      toast.error("Gagal memulihkan produk");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleRestore}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
      ) : (
        <RotateCcw className="w-4 h-4" />
      )}
      <span>Restore</span>
    </button>
  );
}

export function DestroyProductButton({ 
  productId, 
  productName 
}: { 
  productId: string; 
  productName: string; 
}) {
  const [isPending, setIsPending] = useState(false);

  const handleDestroy = async () => {
    if (!window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus produk "${productName}" SECARA PERMANEN?\nTindakan ini tidak dapat dibatalkan!`)) {
      return;
    }

    setIsPending(true);
    try {
      await permanentlyDeleteProduct(productId);
      toast.success(`Produk "${productName}" telah dihapus secara permanen`, {
        icon: "💥"
      });
    } catch (err) {
      toast.error("Gagal menghapus produk secara permanen");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleDestroy}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-red-650" />
      ) : (
        <AlertOctagon className="w-4 h-4" />
      )}
      <span>Destroy</span>
    </button>
  );
}
