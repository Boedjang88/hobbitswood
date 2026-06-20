"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Sparkles, Hammer, Award, Warehouse } from "lucide-react";
import PageEntranceSplash from "@/components/PageEntranceSplash";

// ─── Reusable Animated Components ────────────────────────────────────
const RevealText = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const CinematicImage = ({ src, alt, className = "", children }: { src: string, alt: string, className?: string, children?: React.ReactNode }) => (
  <motion.div
    initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
    whileInView={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    className={`relative overflow-hidden group ${className}`}
  >
    <motion.div 
      className="absolute inset-0 z-0"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image src={src} alt={alt} fill className="object-cover transition-all duration-700" />
    </motion.div>
    {children}
  </motion.div>
);

export default function AboutPage({ waNumber = "6285811362629" }: { waNumber?: string }) {
  const containerRef = useRef<HTMLElement>(null);

  // Hero Scroll Progress
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(heroProgress, [0, 1], [1.02, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -250]);

  // Editorial Scroll Progress
  const editorialRef = useRef<HTMLElement>(null);
  const { scrollYProgress: editorialProgress } = useScroll({
    target: editorialRef,
    offset: ["start start", "end end"]
  });

  // Story sections
  const storySections = [
    {
      title: "Seni Membingkai Memori",
      text: "Sebuah foto menyimpan ribuan kenangan, dan tugas kami adalah memberikannya bingkai (figura) yang layak. Kami memilih kayu jati solid terbaik untuk memastikan setiap momen berharga Anda dibingkai dengan kehangatan dan keabadian.",
      image: "/images/products/figura-jati.jpg"
    },
    {
      title: "Merawat Koleksi",
      text: "Dari etalase kaca elegan hingga lemari kayu bergaya retro, kami memahami bahwa apa yang Anda simpan adalah hal yang berharga. Rak dan lemari kami didesain tidak hanya untuk menyimpan, tetapi untuk memamerkan koleksi Anda dengan bangga.",
      image: "/images/products/etalase-kaca.jpg"
    },
    {
      title: "Eksplorasi Ruang",
      text: "Ruangan yang terbatas bukanlah halangan untuk tampil estetik. Dengan inovasi rak melayang (floating shelf) dan rak susun minimalis, kami membawa harmoni kayu alami ke setiap sudut dinding rumah Anda tanpa memakan banyak tempat.",
      image: "/images/products/rak-dinding.jpg"
    }
  ];

  // Active Index tracker for editorial progress dots
  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(editorialProgress, "change", (latest) => {
    const idx = Math.min(
      storySections.length - 1,
      Math.floor(latest * storySections.length)
    );
    setActiveIdx(idx);
  });

  // Quote Section Parallax
  const quoteRef = useRef<HTMLElement>(null);
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start end", "end start"]
  });
  const quoteBgY = useTransform(quoteProgress, [0, 1], ["-12%", "12%"]);
  const quoteBgScale = useTransform(quoteProgress, [0, 1], [1.08, 1.22]);

  // Collage Section Parallax
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: collageProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"]
  });
  const leftY = useTransform(collageProgress, [0, 1], ["0%", "-10%"]);
  const rightY = useTransform(collageProgress, [0, 1], ["0%", "10%"]);

  // CTA Section Parallax
  const ctaRef = useRef<HTMLElement>(null);
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  const ctaBgScale = useTransform(ctaProgress, [0, 1], [1.1, 1.25]);
  const ctaBgY = useTransform(ctaProgress, [0, 1], ["-10%", "10%"]);

  return (
    <main ref={containerRef} className="min-h-screen w-full bg-brand-light dark:bg-[#111] transition-colors duration-300">
      <PageEntranceSplash />
      
      {/* ─── Hero Section (Parallax) ─── */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }} 
          className="absolute inset-0"
        >
          <Image 
            src="/images/hero.jpg" 
            alt="Hobbits Wood Workshop" 
            fill 
            className="object-cover opacity-60"
            priority
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Ambient background light circle */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
        
        <motion.div 
          style={{ y: heroTextY }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-[10rem] font-serif text-white tracking-wider leading-none mb-6">
              Akar <span className="block italic text-brand-gold mt-2">Tradisi.</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xs md:text-lg text-white/80 tracking-[0.5em] uppercase font-light"
          >
            Mendefinisikan Ulang Kehangatan Ruang
          </motion.p>
        </motion.div>
        
        {/* Sleek luxury mouse scroll down indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] mb-3 font-light text-white/60">Gulir</span>
          <div className="w-[26px] h-[42px] border border-white/20 rounded-full flex justify-center p-2">
            <motion.div 
              animate={{ 
                y: [0, 14, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-[3px] h-[6px] bg-brand-gold rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Chapter 1: The Origin ─── */}
      <section className="py-32 md:py-48 px-6 lg:px-12 bg-brand-light dark:bg-[#111] relative overflow-hidden">
        {/* Background art-gallery circular ornament */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-[0.03]">
          <div className="w-[85vw] h-[85vw] max-w-[800px] max-h-[800px] border border-brand-gold rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <RevealText className="flex flex-col items-center">
            <Sparkles className="w-8 h-8 text-brand-gold/60 mb-6 animate-pulse" />
            <p className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6">Awal Mula</p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-brand-dark dark:text-brand-light leading-[1.2]">
              Lahir dari aroma <span className="italic text-brand-wood dark:text-brand-gold">serbuk gergaji</span> dan gema pukulan pahat.
            </h2>
          </RevealText>
          <RevealText delay={0.2} className="mt-12">
            <p className="text-lg md:text-2xl font-light leading-relaxed text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
              Bermula dari sebuah bengkel kecil di Boyolali, Hobbits Wood dibangun bukan sebagai industri, melainkan sebagai sebuah studio seni. Tempat di mana sepotong kayu mentah dihormati, dipahami arah seratnya, dan dibentuk menjadi manifestasi keindahan fungsional.
            </p>
          </RevealText>
        </div>
      </section>

      {/* ─── Chapter 2: Sticky Editorial ─── */}
      <section ref={editorialRef} className="relative w-full bg-brand-cream dark:bg-[#1A1A1A]">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left: Sticky Image Container (Desktop) */}
          <div className="hidden lg:block w-1/2 h-screen sticky top-0 overflow-hidden bg-black">
            {storySections.map((section, idx) => (
              <div key={idx} className="absolute inset-0">
                <StickyImage src={section.image} index={idx} total={storySections.length} progress={editorialProgress} />
              </div>
            ))}
            
            {/* Sleek Vertical Section Progress Indicator */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-8 text-white font-sans text-xs tracking-[0.25em]">
              {storySections.map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <span className={`font-semibold transition-all duration-500 ${activeIdx === idx ? 'text-brand-gold scale-110 opacity-100' : 'text-white/40 opacity-70'}`}>
                    0{idx + 1}
                  </span>
                  <div className="relative h-[2px] bg-white/10 w-8 overflow-hidden rounded-full">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-brand-gold"
                      initial={{ width: 0 }}
                      animate={{ width: activeIdx === idx ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scrolling Text (Mobile & Desktop) */}
          <div className="w-full lg:w-1/2">
            {storySections.map((section, idx) => (
              <div key={idx} className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 lg:py-0">
                {/* Mobile Image Fallback with rounded gold border */}
                <div className="lg:hidden w-full max-w-md mx-auto aspect-square mb-12 overflow-hidden rounded-3xl shadow-2xl border border-brand-gold/20">
                  <CinematicImage src={section.image} alt={section.title} className="w-full h-full" />
                </div>
                
                <RevealText>
                  <span className="bg-gradient-to-r from-brand-gold to-amber-600 bg-clip-text text-transparent font-serif text-6xl md:text-8xl mb-4 block font-light select-none opacity-80">
                    0{idx + 1}
                  </span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brand-dark dark:text-brand-light mb-6 md:mb-8 tracking-wide leading-tight">
                    {section.title}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed text-brand-dark/80 dark:text-brand-light/80">
                    {section.text}
                  </p>
                </RevealText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Chapter 3: Large Quote Parallax ─── */}
      <section ref={quoteRef} className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: quoteBgY, scale: quoteBgScale }} 
          className="absolute inset-0 bg-brand-dark"
        >
          <Image 
            src="/images/meja-sungkai.jpg" 
            alt="Texture" 
            fill 
            className="object-cover opacity-25 grayscale brightness-75"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-light/10 via-black/40 to-brand-light/10 dark:from-[#111]/10 dark:via-black/60 dark:to-[#111]/10 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <RevealText>
            <div className="w-16 h-[1px] bg-brand-gold/50 mx-auto mb-8" />
            <p className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-relaxed font-light italic px-4">
              "Kami tidak hanya membuat furnitur. Kami menciptakan <span className="text-brand-gold font-normal not-italic">warisan keluarga</span> yang akan diwariskan dari generasi ke generasi."
            </p>
            <div className="w-16 h-[1px] bg-brand-gold/50 mx-auto mt-8" />
          </RevealText>
        </div>
      </section>

      {/* ─── The Masterpieces (Masonry/Collage Highlight) ─── */}
      <section className="py-32 md:py-48 px-6 lg:px-12 bg-brand-light dark:bg-[#111]">
        <div className="max-w-7xl mx-auto">
          
          <div ref={collageRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (5/12 width) - Large Image */}
            <motion.div style={{ y: leftY }} className="lg:col-span-5 flex flex-col gap-6">
              <CinematicImage src="/images/products/kabinet-dapur.jpg" alt="Cabinet" className="h-[60vh] lg:h-[80vh] rounded-3xl shadow-2xl">
                <div className="absolute bottom-6 left-6 z-10 text-white">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-80">Desain Kabinet</p>
                  <h4 className="text-xl font-serif mt-1">Kabinet Dapur Klasik</h4>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              </CinematicImage>
            </motion.div>

            {/* Right Column (7/12 width) - Content and Secondary Grid */}
            <motion.div style={{ y: rightY }} className="lg:col-span-7 flex flex-col gap-12 lg:gap-16 lg:pt-24">
              <RevealText>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-brand-gold" />
                  <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold block">Keahlian</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-dark dark:text-brand-light mb-6">Mendetail Hingga Mili</h2>
                <p className="text-lg md:text-xl font-light text-brand-dark/70 dark:text-brand-light/70 leading-relaxed max-w-2xl">
                  Finishing adalah jiwa dari kayu. Menggunakan pelitur berbahan dasar alami, kami menonjolkan urat kayu Jati dan Sungkai, melindunginya tanpa menyembunyikan keindahan aslinya pada setiap laci dan rak pajangan.
                </p>
              </RevealText>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <CinematicImage src="/images/products/rak-dinding.jpg" alt="Shelf Details" className="h-[35vh] lg:h-[45vh] rounded-3xl shadow-xl">
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-80">Interior Minimalis</p>
                    <h4 className="text-lg font-serif mt-1">Rak Dinding Melayang</h4>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </CinematicImage>

                <CinematicImage src="/images/products/drawer-vintage.jpg" alt="Drawer Details" className="h-[35vh] lg:h-[45vh] sm:mt-12 rounded-3xl shadow-xl">
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-80">Gaya Klasik</p>
                    <h4 className="text-lg font-serif mt-1">Drawer Vintage Jati</h4>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </CinematicImage>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section ref={ctaRef} className="py-32 px-6 bg-brand-wood text-brand-light relative overflow-hidden">
        <motion.div 
          style={{ scale: ctaBgScale, y: ctaBgY }} 
          className="absolute inset-0 opacity-15"
        >
          <Image src="/images/workshop.jpg" alt="BG" fill className="object-cover" />
        </motion.div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <RevealText className="flex flex-col items-center">
            <Warehouse className="w-8 h-8 text-brand-gold/80 mb-6" />
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              Mulai Cerita Anda <br/>
              <span className="text-brand-gold italic">Bersama Kami.</span>
            </h2>
            <p className="mb-12 text-brand-light/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Eksplorasi koleksi eksklusif Hobbits Wood atau hubungi kami untuk mendiskusikan visi interior impian Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link 
                href="/shop" 
                className="w-full sm:w-auto px-12 py-5 bg-brand-gold text-brand-dark font-semibold tracking-widest uppercase hover:bg-white transition-all duration-300 rounded-full shadow-lg hover:shadow-brand-gold/20 hover:-translate-y-0.5"
              >
                Katalog Kami
              </Link>
              <a 
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-12 py-5 border border-brand-light/30 text-brand-light font-semibold tracking-widest uppercase text-center hover:bg-brand-light hover:text-brand-dark transition-all duration-300 rounded-full hover:-translate-y-0.5 inline-block"
              >
                Custom Order
              </a>
            </div>
          </RevealText>
        </div>
      </section>
    </main>
  );
}

// ─── Helper for Sticky Left Images ───
function StickyImage({ src, index, total, progress }: { src: string, index: number, total: number, progress: any }) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = (index + 1) * segmentSize;
  
  // Fade in at start of segment, fade out at end of segment
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.15), start, end, Math.min(1, end + 0.15)],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    progress,
    [Math.max(0, start - 0.15), start, end, Math.min(1, end + 0.15)],
    [1.12, 1, 1, 1.12]
  );

  const y = useTransform(
    progress,
    [Math.max(0, start - 0.15), start, end, Math.min(1, end + 0.15)],
    ["8%", "0%", "0%", "-8%"]
  );

  return (
    <motion.div 
      style={{ opacity, scale, y }} 
      className="absolute inset-0 w-full h-full"
    >
      <Image src={src} alt="Story Image" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/35" />
    </motion.div>
  );
}
