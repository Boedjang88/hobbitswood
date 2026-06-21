"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    y: 0,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    y: 0,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const lastIndex = useRef(currentIndex);
  const [slideDirection, setSlideDirection] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync slide direction when index changes
  useEffect(() => {
    if (currentIndex !== lastIndex.current) {
      // Handle wrap-around index direction correctly
      if (currentIndex === 0 && lastIndex.current === images.length - 1) {
        setSlideDirection(1);
      } else if (currentIndex === images.length - 1 && lastIndex.current === 0) {
        setSlideDirection(-1);
      } else {
        setSlideDirection(currentIndex > lastIndex.current ? 1 : -1);
      }
      lastIndex.current = currentIndex;
      setScale(1);
    }
  }, [currentIndex, images.length]);

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
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(3.5, prev + 0.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(1, prev - 0.5));
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      
      {/* Top Bar Indicator */}
      <div className="absolute top-4 left-4 z-[120] text-white/90 font-semibold text-xs bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md tracking-wider">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Control Buttons (zoom only, no close) */}
      <div className="absolute top-4 right-4 z-[120] flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Zoom Out Button - desktop only */}
        <button
          onClick={handleZoomOut}
          disabled={scale === 1}
          className="hidden md:flex rounded-full bg-black/50 border border-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none items-center justify-center"
          title="Zoom Out"
        >
          <Minus className="h-5 w-5" />
        </button>

        {/* Zoom Value - desktop only */}
        <span className="hidden md:flex text-white text-xs font-mono font-semibold w-10 text-center bg-black/30 border border-white/5 py-1.5 rounded-lg">
          {scale.toFixed(1)}x
        </span>

        {/* Zoom In Button - desktop only */}
        <button
          onClick={handleZoomIn}
          disabled={scale === 3.5}
          className="hidden md:flex rounded-full bg-black/50 border border-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none items-center justify-center"
          title="Zoom In"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Left Chevron (Desktop Only) */}
      {images.length > 1 && scale === 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="hidden md:flex absolute left-6 z-[110] rounded-full bg-black/50 border border-white/10 p-3.5 text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Main Image Container with AnimatePresence Slider */}
      <div 
        ref={containerRef}
        className="relative h-[60svh] md:h-[68vh] w-[95vw] max-w-4xl flex items-center justify-center overflow-hidden touch-none"
      >
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={currentIndex}
            custom={slideDirection}
            variants={scale === 1 ? (slideVariants as any) : undefined}
            initial={scale === 1 ? "enter" : undefined}
            exit={scale === 1 ? "exit" : undefined}
            drag={scale > 1 ? true : "x"}
            dragConstraints={
              scale > 1 
                ? { left: -500, right: 500, top: -400, bottom: 400 } 
                : { left: 0, right: 0 }
            }
            dragElastic={scale > 1 ? 0.15 : 0.65}
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
            animate={scale > 1 ? { scale } : "center"}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            onDoubleClick={handleDoubleTap}
            className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing w-auto h-auto"
          >
            <div 
              className="relative max-w-[95vw] max-h-[60svh] md:max-h-[68vh] w-auto h-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`Product detail image view ${currentIndex + 1}`}
                className="max-w-[95vw] max-h-[60svh] md:max-h-[68vh] w-auto h-auto object-contain select-none"
                draggable="false"
              />
              {/* Close button — corner of image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-3 right-3 z-[130] rounded-full bg-black/60 border border-white/15 p-2 text-white hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center backdrop-blur-sm"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Chevron (Desktop Only) */}
      {images.length > 1 && scale === 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="hidden md:flex absolute right-6 z-[110] rounded-full bg-black/50 border border-white/10 p-3.5 text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Mobile-only bottom zoom bar */}
      {scale >= 1 && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10"
        >
          <button
            onClick={handleZoomOut}
            disabled={scale === 1}
            className="rounded-full bg-black/50 border border-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-white text-xs font-mono font-semibold w-10 text-center">
            {scale.toFixed(1)}x
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale === 3.5}
            className="rounded-full bg-black/50 border border-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Thumbnail Bar */}
      {images.length > 1 && scale === 1 && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 overflow-x-auto max-w-[90vw] px-4 py-2.5 scrollbar-hide bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (idx > currentIndex) {
                  for (let i = 0; i < idx - currentIndex; i++) onNext();
                } else if (idx < currentIndex) {
                  for (let i = 0; i < currentIndex - idx; i++) onPrev();
                }
              }}
              className={`relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all opacity-60 ${
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
