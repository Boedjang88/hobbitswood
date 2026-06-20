"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartDrawer({ waNumber = "6285811362629" }: { waNumber?: string }) {
  const { items, isDrawerOpen, toggleDrawer, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let message = "Halo Hobbits Wood, saya ingin memesan produk berikut:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.selectedVariant) message += `   Dimensi: ${item.selectedVariant}\n`;
      if (item.selectedMaterial) message += `   Material: ${item.selectedMaterial}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Harga: Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n\n`;
    });
    message += `*Total Estimasi: Rp ${getTotalPrice().toLocaleString("id-ID")}*\n\nMohon informasi ongkos kirim dan ketersediaan stok.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => toggleDrawer(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-brand-cream dark:bg-[#2A2A2A] z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-brand-wood/10 dark:border-brand-light/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-dark dark:text-brand-light" />
            <h2 className="font-serif text-xl text-brand-dark dark:text-brand-light">Keranjang Belanja</h2>
          </div>
          <button 
            onClick={() => toggleDrawer(false)}
            className="p-2 hover:bg-brand-wood/10 dark:hover:bg-brand-light/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-brand-dark dark:text-brand-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag className="w-16 h-16 text-brand-dark font-medium dark:text-brand-light" />
              <p className="text-brand-dark dark:text-brand-light">Keranjang Anda masih kosong</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-brand-wood/5 dark:border-brand-light/5">
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-brand-cream dark:bg-brand-dark">
                  <Image src={item.image && item.image !== "[]" ? item.image : "/images/hero.jpg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-brand-dark dark:text-brand-light text-sm truncate">{item.name}</h3>
                    {(item.selectedVariant || item.selectedMaterial) && (
                      <p className="text-xs text-brand-dark font-medium dark:text-brand-light mt-1 truncate">
                        {item.selectedMaterial} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                      </p>
                    )}
                    <p className="font-semibold text-brand-dark dark:text-brand-light text-sm mt-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-brand-wood/20 dark:border-brand-light/20 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-brand-dark dark:text-brand-light hover:bg-brand-wood/10 dark:hover:bg-brand-light/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-brand-dark dark:text-brand-light">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-brand-dark dark:text-brand-light hover:bg-brand-wood/10 dark:hover:bg-brand-light/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-brand-wood/10 dark:border-brand-light/10 bg-brand-cream dark:bg-[#2A2A2A]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-brand-dark dark:text-brand-light font-medium">Total Estimasi</span>
              <span className="text-xl font-serif text-brand-dark dark:text-brand-light">
                Rp {getTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-md font-medium tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Checkout via WhatsApp
            </button>
            <p className="text-xs text-center text-brand-dark font-medium dark:text-brand-light mt-4">
              Pengiriman & estimasi waktu akan diinformasikan oleh admin kami.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
