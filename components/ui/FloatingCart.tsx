"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { items, toggleDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => toggleDrawer(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 ring-4 ring-brand-gold/20"
          aria-label="Keranjang Belanja"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white shadow-md animate-bounce">
              {totalItems}
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
