"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't render in admin panel globally, only where placed
  if (!className && pathname?.startsWith("/admin")) return null;

  const defaultClass = "p-2 rounded-full text-brand-light hover:text-brand-gold transition-colors";

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className || defaultClass}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
}
