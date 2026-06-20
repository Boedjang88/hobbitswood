"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-6 z-[110] rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      <div className="relative h-[80vh] w-[90vw] max-w-5xl">
        <Image
          src={images[currentIndex]}
          alt="Product Image"
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-6 z-[110] rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
      
      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 py-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={idx > currentIndex ? () => { for(let i=0; i<idx-currentIndex; i++) onNext() } : () => { for(let i=0; i<currentIndex-idx; i++) onPrev() }}
              className={`relative h-16 w-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all opacity-70 ${
                idx === currentIndex ? "border-white opacity-100 scale-110" : "border-transparent hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
