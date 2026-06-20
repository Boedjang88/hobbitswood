"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingBag, Home, BookOpen, HelpCircle, Phone, MessageSquare } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useCartStore } from "@/lib/store/cartStore";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/shop" },
  { label: "Cerita Kami", href: "/our-story" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar({ customOrderLink = "https://wa.me/6285811362629", waLink = "https://wa.me/6285811362629" }: { customOrderLink?: string, waLink?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  
  const { items, toggleDrawer } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle window resize to prevent locked scroll bug
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-brand-wood dark:bg-brand-dark shadow-md border-b border-brand-wood/80 dark:border-brand-dark/80" 
            : "bg-brand-wood/90 dark:bg-brand-dark/90 shadow-sm border-b border-brand-wood/50 dark:border-brand-dark/50"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group block flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/images/hobbits-wood-logo.svg" 
                alt="Hobbits Wood Logo" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
            <span className="block h-[1px] w-0 bg-brand-gold transition-all duration-500 group-hover:w-full" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative text-sm tracking-wide transition-colors duration-300 text-brand-light/80 hover:text-brand-gold`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-4">
              <a
                href={customOrderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-gold px-5 py-2 text-xs font-semibold tracking-wide text-brand-dark transition-transform hover:scale-105 hover:bg-brand-light"
              >
                Custom Order
              </a>
              <button 
                onClick={() => setSearchOpen(true)}
                className="relative text-brand-light hover:text-brand-gold transition-colors p-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => toggleDrawer(true)}
                className="relative text-brand-light hover:text-brand-gold transition-colors p-2"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-brand-dark animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              <ThemeToggle className="relative text-brand-light hover:text-brand-gold transition-colors p-2" />
            </li>
          </ul>

          {/* Mobile toggle & theme */}
          <div className="flex items-center gap-2 md:hidden relative z-50">
            <ThemeToggle className="relative text-brand-light hover:text-brand-gold transition-colors p-2" />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative p-2"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              id="mobile-nav-toggle"
            >
              <div className="relative h-6 w-6 text-brand-light">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    mobileOpen
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    mobileOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Global Search Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-brand-light/95 dark:bg-brand-dark/95 backdrop-blur-sm transition-all duration-300 flex items-start justify-center pt-32 px-6 ${
          searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-2xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("q");
              if (q) {
                setSearchOpen(false);
                window.location.href = `/shop?q=${encodeURIComponent(q.toString())}`;
              }
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-dark/50 dark:text-brand-light/50" />
              <input 
                type="text" 
                name="q"
                autoFocus={searchOpen}
                placeholder="Cari produk impian Anda..." 
                className="w-full h-16 pl-14 pr-16 text-lg lg:text-xl bg-white dark:bg-zinc-900 border border-brand-wood/20 dark:border-brand-light/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-brand-light shadow-xl"
              />
              <button 
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-dark/50 hover:text-brand-dark dark:text-brand-light/50 dark:hover:text-brand-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center mt-4 text-sm text-brand-dark/60 dark:text-brand-light/60">
              Tekan Enter untuk mencari
            </p>
          </form>
        </div>
      </div>

      {/* Mobile menu backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu sliding side-drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 w-[280px] max-w-[85vw] bg-white dark:bg-zinc-900 text-brand-dark dark:text-zinc-100 border-l border-[#EAEAEA] dark:border-zinc-800 shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6">
          
          {/* Logo / Header Area */}
          <div className="flex items-center justify-between px-6 pb-6 border-b border-[#EAEAEA] dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image 
                  src="/images/hobbits-wood-logo.svg" 
                  alt="Hobbits Wood Logo" 
                  fill 
                  className="object-contain dark:invert" 
                />
              </div>
              <span className="font-serif font-bold text-base text-brand-dark dark:text-zinc-100">Hobbits Wood</span>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark/60 dark:text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500 mb-3 px-2">Menu Utama</p>
              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300"
                >
                  <Home className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <span>Beranda</span>
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300"
                >
                  <ShoppingBag className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <span>Katalog</span>
                </Link>
                <Link
                  href="/our-story"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300"
                >
                  <BookOpen className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <span>Cerita Kami</span>
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <span>Bantuan & FAQ</span>
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500 mb-3 px-2">Belanja</p>
              <nav className="space-y-1">
                {/* Search */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300 text-left"
                >
                  <Search className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <span>Cari Produk</span>
                </button>
                {/* Cart */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    toggleDrawer(true);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 text-[#444] dark:text-zinc-300 text-left"
                >
                  <div className="relative">
                    <ShoppingBag className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                    {mounted && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-gold text-[8px] font-bold text-brand-dark">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>Keranjang Belanja</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Quick Actions at Bottom */}
          <div className="p-4 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-900/50 flex flex-col gap-2 mt-auto">
            <a
              href={customOrderLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="w-full flex justify-center items-center gap-2 p-2.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Custom Order</span>
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="w-full flex justify-center items-center gap-2 p-2.5 border border-[#EAEAEA] dark:border-zinc-800 hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark dark:text-zinc-300 rounded-xl text-xs font-semibold transition-all"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Hubungi WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
