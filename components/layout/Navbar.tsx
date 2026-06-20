"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
              <ThemeToggle className="relative text-brand-light hover:text-brand-gold transition-colors p-2" />
            </li>
          </ul>

          {/* Mobile toggle & cart */}
          <div className="flex items-center gap-4 md:hidden relative z-50">
            <button 
              onClick={() => setSearchOpen(true)}
              className="relative text-brand-light hover:text-brand-gold transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle className="relative text-brand-light hover:text-brand-gold transition-colors p-2" />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative"
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

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-brand-light dark:bg-brand-dark transition-all duration-500 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="overflow-hidden"
            >
              <span
                className={`block font-serif text-4xl tracking-wide text-brand-dark dark:text-brand-light transition-all duration-500 hover:text-brand-gold ${
                  mobileOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${150 + i * 75}ms` }}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* Mobile CTA */}
          <div
            className={`mt-4 flex flex-col items-center gap-4 transition-all duration-500 ${
              mobileOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "375ms" }}
          >
            <a
              href={customOrderLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-brand-gold px-10 py-3 text-sm font-semibold tracking-wide text-brand-dark transition-all duration-500 hover:scale-105"
            >
              Custom Order
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-wood/30 px-10 py-3 text-sm tracking-wide text-brand-dark dark:text-brand-light transition-all duration-500 hover:bg-brand-wood hover:text-brand-light"
            >
              Hubungi WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
