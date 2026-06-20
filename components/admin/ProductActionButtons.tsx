"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { softDeleteProduct, toggleProductStatus } from "@/lib/actions";
import { toast } from "sonner";

export function ToggleStatusButton({ 
  productId, 
  productName, 
  currentStatus 
}: { 
  productId: string; 
  productName: string; 
  currentStatus: string; 
}) {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    const actionText = currentStatus === "PUBLISHED" ? "mengarsipkan (DRAFT)" : "menerbitkan (PUBLISHED)";
    if (!window.confirm(`Apakah Anda yakin ingin ${actionText} produk "${productName}"?`)) {
      return;
    }

    setIsPending(true);
    try {
      await toggleProductStatus(productId);
      toast.success(`Status produk "${productName}" berhasil diubah!`, {
        icon: "✨",
        description: `Produk kini berstatus ${currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED"}`
      });
    } catch (err) {
      toast.error("Gagal mengubah status produk");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-2.5 sm:py-1 text-xs sm:text-[11px] font-semibold rounded-full transition-all ${
        isPending ? "opacity-50 pointer-events-none" : ""
      } ${
        currentStatus === "PUBLISHED"
          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
          : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-gold shrink-0" />
      ) : (
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${currentStatus === "PUBLISHED" ? "bg-emerald-500 animate-pulse" : "bg-gray-400 dark:bg-zinc-500"}`} />
      )}
      {currentStatus}
    </button>
  );
}

export function DeleteProductButton({ 
  productId, 
  productName,
  mobileClass = ""
}: { 
  productId: string; 
  productName: string;
  mobileClass?: string;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin memindahkan produk "${productName}" ke Tempat Sampah?`)) {
      return;
    }

    setIsPending(true);
    try {
      await softDeleteProduct(productId);
      toast.success(`Produk "${productName}" berhasil dipindahkan ke Tempat Sampah`, {
        icon: "🗑️"
      });
    } catch (err) {
      toast.error("Gagal menghapus produk");
    } finally {
      setIsPending(false);
    }
  };

  const buttonStyle = mobileClass 
    ? mobileClass 
    : "inline-flex p-2.5 sm:p-2 text-brand-dark dark:text-brand-light hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900";

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`${buttonStyle} ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      title="Move to Trash"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin text-red-500" />
      ) : (
        <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
      )}
    </button>
  );
}
