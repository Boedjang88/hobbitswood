"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function ScrollDrivenHero() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  
  // Apply a spring to smooth out the raw scroll value
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const y = useTransform(smoothScrollY, [0, 1000], [0, 150]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-12">
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
      >
        <Image 
          src="/images/hero.jpg" 
          alt="Hobbits Wood" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-black/60 transition-colors duration-300" />
      </motion.div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-brand-gold uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-lg font-bold mb-4 md:mb-6"
        >
          Elegansi Alam, Mahakarya Abadi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-brand-light tracking-wide leading-tight mb-6 md:mb-8 drop-shadow-2xl px-2"
        >
          Hadirkan Kehangatan <br className="hidden md:block" /> Di Rumah Anda.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <Link 
            href="/shop"
            className="inline-block px-8 py-3 md:px-10 md:py-4 bg-brand-gold text-brand-dark hover:bg-brand-light transition-colors duration-300 font-semibold tracking-widest uppercase text-xs md:text-sm rounded-sm shadow-xl"
          >
            Eksplorasi Katalog
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
