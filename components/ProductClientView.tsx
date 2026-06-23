"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag, Plus, Minus, ChevronDown, Check, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import Lightbox from "@/components/ui/Lightbox";

export default function ProductClientView({ product, waNumber = "6285811362629" }: { product: any, waNumber?: string }) {
  // Parse dimensions and materials safely
  const dimensions = (() => {
    try {
      const parsed = JSON.parse(product.dimensions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const materials = (() => {
    try {
      const parsed = JSON.parse(product.materials);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  // Safely parse images
  const images = (() => {
    try {
      if (!product.images || product.images === "[]") return [];
      const parsed = JSON.parse(product.images);
      const validImages = Array.isArray(parsed) ? parsed.filter(i => typeof i === 'string' && i.trim() !== "") : [];
      return validImages;
    } catch {
      return [];
    }
  })();

  const primaryImage = images.length > 0 ? images[0] : "/images/hero.jpg";
  const [activeImage, setActiveImage] = useState(images[0] || primaryImage);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : [primaryImage];

  // Sync mobile carousel scroll with activeImage
  useEffect(() => {
    if (mobileCarouselRef.current && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const idx = displayImages.indexOf(activeImage);
      if (idx !== -1) {
        const width = mobileCarouselRef.current.clientWidth;
        mobileCarouselRef.current.scrollTo({
          left: idx * width,
          behavior: 'smooth'
        });
      }
    }
  }, [activeImage, displayImages]);

  const [selectedDimension, setSelectedDimension] = useState(dimensions[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("desc");

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  
  // Wishlist state (local for now)
  const [inWishlist, setInWishlist] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuickAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      quantity,
      selectedVariant: selectedDimension || undefined,
      selectedMaterial: selectedMaterial || undefined,
    });
  };

  // Safe WhatsApp Link
  const waText = encodeURIComponent(`Halo, saya tertarik dengan ${product.name} (${formatPrice(product.price)}). Apakah masih tersedia?`);
  const whatsappHref = `https://wa.me/${waNumber}?text=${waText}`;

  // Safe Marketplace links
  const links = Array.isArray(product.links) ? product.links : [];
  const tokopedia = links.find((l: any) => l.platform.toLowerCase() === "tokopedia");
  const shopee = links.find((l: any) => l.platform.toLowerCase() === "shopee");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 pb-12">
      {/* Left: Image Gallery */}
      <div className="lg:col-span-7">
        <div className="relative lg:sticky top-0 lg:top-24 space-y-4 lg:space-y-6">
          <div className="relative aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-xl lg:rounded-2xl bg-brand-cream dark:bg-zinc-900 border border-brand-wood/10 dark:border-white/5 group">
            
            {/* Desktop: Single Image with fade transition */}
            <div className="hidden lg:block absolute inset-0">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* Mobile: Swipeable Snap Carousel */}
            <div 
              ref={mobileCarouselRef}
              className="flex lg:hidden absolute inset-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = e.currentTarget.clientWidth;
                const index = Math.round(scrollLeft / width);
                if (displayImages[index] && displayImages[index] !== activeImage) {
                  setActiveImage(displayImages[index]);
                }
              }}
            >
              {displayImages.map((img: string, idx: number) => (
                <div key={idx} className="relative min-w-full h-full snap-center flex-shrink-0">
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" priority={idx === 0} />
                </div>
              ))}
            </div>

            {/* Mobile: Image Counter Badge */}
            <div className="absolute bottom-4 right-4 z-10 lg:hidden px-3 py-1 bg-black/60 text-white text-[10px] font-semibold rounded-full backdrop-blur-md border border-white/10 tracking-wider">
              {displayImages.indexOf(activeImage) + 1} / {displayImages.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const idx = images.indexOf(activeImage);
                    const prevIdx = (idx - 1 + images.length) % images.length;
                    setActiveImage(images[prevIdx >= 0 ? prevIdx : 0]);
                  }}
                  className="hidden lg:flex absolute left-4 top-1/2 z-10 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-110 shadow-sm"
                  aria-label="Gambar Sebelumnya"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    const idx = images.indexOf(activeImage);
                    const nextIdx = (idx + 1) % images.length;
                    setActiveImage(images[nextIdx >= 0 ? nextIdx : 0]);
                  }}
                  className="hidden lg:flex absolute right-4 top-1/2 z-10 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-110 shadow-sm"
                  aria-label="Gambar Selanjutnya"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <button
              onClick={() => openLightbox(images.indexOf(activeImage) >= 0 ? images.indexOf(activeImage) : 0)}
              className="hidden lg:flex absolute top-4 right-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-110 shadow-sm"
              aria-label="Lihat Full"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Action Bar (Only Lihat Full) */}
          <div className="flex lg:hidden items-center justify-center w-full mt-2">
            <button
              onClick={() => openLightbox(images.indexOf(activeImage) >= 0 ? images.indexOf(activeImage) : 0)}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-wood/20 dark:border-white/10 text-brand-dark dark:text-brand-light text-xs font-medium hover:bg-brand-wood/5 dark:hover:bg-white/5 active:scale-95 transition-all duration-300"
            >
              <Maximize2 className="w-4 h-4" /> Buka Layar Penuh
            </button>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 lg:pb-4 scrollbar-hide snap-x mt-2 lg:mt-0">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-16 w-16 lg:h-24 lg:w-24 flex-shrink-0 snap-start overflow-hidden rounded-lg lg:rounded-xl transition-all duration-300 ${
                    activeImage === img
                      ? "ring-2 ring-brand-wood dark:ring-brand-gold scale-95 opacity-100 shadow-lg"
                      : "ring-1 ring-transparent opacity-60 hover:opacity-100 hover:scale-95 hover:shadow-md"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="lg:col-span-5 flex flex-col justify-start pt-2 lg:pt-10">
        <div className="mb-4 lg:mb-8">
          <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl tracking-wide text-brand-dark dark:text-brand-light mb-2 lg:mb-4">
            {product.name}
          </h1>
          <p className="text-lg lg:text-2xl font-serif text-brand-wood dark:text-brand-gold">
            {formatPrice(product.price * quantity)}
          </p>
        </div>

        {/* Variants: Dimension */}
        {dimensions.length > 0 && (
          <div className="mb-6 lg:mb-8 border-t border-brand-wood/10 dark:border-white/10 pt-4 lg:pt-6">
            <h3 className="text-xs lg:text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3 lg:mb-4 font-medium">Dimensi</h3>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {dimensions.map((dim: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDimension(dim)}
                  className={`px-4 py-2 lg:px-6 lg:py-3 rounded-full text-xs lg:text-sm transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md ${
                    selectedDimension === dim
                      ? "border-brand-dark bg-brand-dark text-white dark:bg-brand-light dark:text-brand-dark dark:border-brand-light"
                      : "border-brand-wood/20 hover:border-brand-dark dark:border-white/10 dark:hover:border-white/30 text-brand-dark dark:text-brand-light hover:bg-brand-wood/5 dark:hover:bg-white/5"
                  }`}
                >
                  {dim}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants: Material */}
        {materials.length > 0 && (
          <div className="mb-6 lg:mb-8 border-t border-brand-wood/10 dark:border-white/10 pt-4 lg:pt-6">
            <h3 className="text-xs lg:text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3 lg:mb-4 font-medium">Material</h3>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {materials.map((mat: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-4 py-2 lg:px-6 lg:py-3 rounded-full text-xs lg:text-sm transition-all duration-300 border flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md ${
                    selectedMaterial === mat
                      ? "border-brand-dark bg-brand-dark text-white dark:bg-brand-light dark:text-brand-dark dark:border-brand-light"
                      : "border-brand-wood/20 hover:border-brand-dark dark:border-white/10 dark:hover:border-white/30 text-brand-dark dark:text-brand-light hover:bg-brand-wood/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-brand-wood dark:bg-brand-gold" />
                  {mat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions: Quantity & Add to Cart */}
        <div className="mb-8 lg:mb-10 flex flex-col gap-3 lg:gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex items-center border border-brand-wood/20 dark:border-white/10 rounded-full h-12 lg:h-14 px-1 lg:px-2 bg-white/50 dark:bg-black/20 shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 lg:p-3 text-brand-dark dark:text-brand-light hover:text-brand-wood dark:hover:text-brand-gold active:scale-90 transition-all">
                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <span className="w-6 lg:w-8 text-center text-sm lg:text-base font-medium text-brand-dark dark:text-brand-light">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 lg:p-3 text-brand-dark dark:text-brand-light hover:text-brand-wood dark:hover:text-brand-gold active:scale-90 transition-all">
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
            <button 
              onClick={handleQuickAdd}
              className="flex-1 h-12 lg:h-14 bg-brand-dark dark:bg-brand-light text-white dark:text-brand-dark font-medium tracking-wide uppercase text-xs lg:text-sm rounded-full flex items-center justify-center gap-2 hover:bg-brand-wood dark:hover:bg-brand-gold hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
              Tambahkan
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {tokopedia && tokopedia.url ? (
              <a href={tokopedia.url} target="_blank" rel="noopener noreferrer" className="h-10 lg:h-12 flex items-center justify-center gap-2 border border-[#42B549]/30 bg-[#42B549]/5 text-[#42B549] rounded-full text-xs lg:text-sm font-medium hover:bg-[#42B549] hover:text-white hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300">
                Beli di Tokopedia
              </a>
            ) : null}
            {shopee && shopee.url ? (
              <a href={shopee.url} target="_blank" rel="noopener noreferrer" className="h-10 lg:h-12 flex items-center justify-center gap-2 border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 text-[#EE4D2D] rounded-full text-xs lg:text-sm font-medium hover:bg-[#EE4D2D] hover:text-white hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300">
                Beli di Shopee
              </a>
            ) : null}
          </div>

          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="h-10 lg:h-12 flex items-center justify-center gap-2 border border-brand-wood/20 dark:border-white/10 rounded-full text-xs lg:text-sm font-medium text-brand-dark dark:text-brand-light hover:border-brand-dark dark:hover:border-white hover:bg-brand-dark hover:text-white dark:hover:bg-white dark:hover:text-brand-dark hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300">
            Tanya via WhatsApp
          </a>
        </div>

        {/* Accordions */}
        <div className="border-t border-brand-wood/10 dark:border-white/10">
          <div className="border-b border-brand-wood/10 dark:border-white/10">
            <button 
              onClick={() => setExpandedSection(expandedSection === "desc" ? null : "desc")}
              className="w-full py-4 lg:py-6 flex items-center justify-between text-left focus:outline-none group"
            >
              <span className="font-serif text-lg lg:text-xl text-brand-dark dark:text-brand-light group-hover:text-brand-wood transition-colors">Deskripsi Lengkap</span>
              <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-brand-dark dark:text-brand-light transition-transform duration-300 ${expandedSection === "desc" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === "desc" ? "max-h-[1000px] opacity-100 pb-4 lg:pb-6" : "max-h-0 opacity-0"}`}>
              <p className="text-sm lg:text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed font-medium whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          <div className="border-b border-brand-wood/10 dark:border-white/10">
            <button 
              onClick={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")}
              className="w-full py-4 lg:py-6 flex items-center justify-between text-left focus:outline-none group"
            >
              <span className="font-serif text-lg lg:text-xl text-brand-dark dark:text-brand-light group-hover:text-brand-wood transition-colors">Pengiriman & Retur</span>
              <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-brand-dark dark:text-brand-light transition-transform duration-300 ${expandedSection === "shipping" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === "shipping" ? "max-h-[500px] opacity-100 pb-4 lg:pb-6" : "max-h-0 opacity-0"}`}>
              <p className="text-sm lg:text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed font-medium">
                Gratis ongkir untuk area tertentu. Pengiriman menggunakan kargo khusus furniture. Garansi kerusakan dalam perjalanan (harus menyertakan video unboxing). Estimasi pengiriman 3-14 hari kerja tergantung lokasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        images={images.length > 0 ? images : [activeImage]}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % Math.max(1, images.length))}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + Math.max(1, images.length)) % Math.max(1, images.length))}
      />


    </div>
  );
}
