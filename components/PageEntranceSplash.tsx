"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PageEntranceSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Durasi tayang splash screen sebelum memudar (1.8 detik)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A] pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="text-center"
          >
            <div className="relative w-[350px] h-[350px] md:w-[700px] md:h-[700px] mb-6 mx-auto flex-shrink-0">
              <Image 
                src="/images/hobbits-wood-logo.svg" 
                alt="Hobbits Wood Logo" 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority 
              />
            </div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="h-1 bg-brand-gold mx-auto" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
