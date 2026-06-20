"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset scale and position when current image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && scale === 1) onNext();
      if (e.key === "ArrowLeft" && scale === 1) onPrev();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, scale]);

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2.2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm select-none">
      {/* Indicator - Tokopedia/Shopee style */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-semibold text-sm bg-black/50 border border-white/10 px-4 py-1.5 rounded-full z-[120] backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-[120] flex items-center gap-2">
        <button
          onClick={handleDoubleTap}
          className="rounded-full bg-black/50 border border-white/10 p-2.5 text-white hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
          title="Zoom Image"
        >
          {scale === 1 ? <ZoomIn className="h-5 w-5" /> : <ZoomOut className="h-5 w-5" />}
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-black/50 border border-white/10 p-2.5 text-white hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Left Chevron (Desktop Only) */}
      {images.length > 1 && scale === 1 && (
        <button
          onClick={onPrev}
          className="hidden md:flex absolute left-6 z-[110] rounded-full bg-black/50 border border-white/10 p-3.5 text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className="relative h-[65vh] w-[95vw] max-w-4xl flex items-center justify-center overflow-hidden touch-none"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          drag={scale > 1 ? true : "x"}
          dragConstraints={
            scale > 1 
              ? { left: -400, right: 400, top: -300, bottom: 300 } 
              : { left: 0, right: 0 }
          }
          dragElastic={scale > 1 ? 0.15 : 0.6}
          onDragEnd={(e, info) => {
            if (scale === 1) {
              const swipeThreshold = 60;
              if (info.offset.x < -swipeThreshold) {
                onNext();
              } else if (info.offset.x > swipeThreshold) {
                onPrev();
              }
            }
          }}
          animate={{ scale, x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          onUpdate={(latest) => {
            // Keep position tracking updated when dragged
            if (scale > 1) {
              setPosition({ x: latest.x as number, y: latest.y as number });
            }
          }}
          className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <Image
            src={images[currentIndex]}
            alt={`Product detail image view ${currentIndex + 1}`}
            fill
            className="object-contain pointer-events-none select-none"
            priority
            unoptimized
          />
        </motion.div>
      </div>

      {/* Right Chevron (Desktop Only) */}
      {images.length > 1 && scale === 1 && (
        <button
          onClick={onNext}
          className="hidden md:flex absolute right-6 z-[110] rounded-full bg-black/50 border border-white/10 p-3.5 text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Thumbnail Bar */}
      {images.length > 1 && scale === 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 overflow-x-auto max-w-[90vw] px-4 py-2 scrollbar-hide bg-black/30 rounded-2xl border border-white/5 backdrop-blur-sm">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx > currentIndex) {
                  for (let i = 0; i < idx - currentIndex; i++) onNext();
                } else {
                  for (let i = 0; i < currentIndex - idx; i++) onPrev();
                }
              }}
              className={`relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all opacity-60 ${
                idx === currentIndex ? "border-brand-gold opacity-100 scale-105" : "border-transparent hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail preview ${idx + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
