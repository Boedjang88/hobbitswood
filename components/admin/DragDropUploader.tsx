"use client";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Trash2, UploadCloud, ImagePlus, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

export default function DragDropUploader({ images, setImages }: { images: string[], setImages: any }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefForReplace = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const processFiles = async (files: File[]) => {
    setIsCompressing(true);
    try {
      const compressedImages = await Promise.all(
        files.map((file) => compressImage(file))
      );
      
      setImages((prev: string[]) => {
        const newArr = prev.filter(img => img !== "");
        return [...newArr, ...compressedImages];
      });
    } catch (error) {
      console.error("Failed to compress images", error);
      alert("Failed to process some images.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      processFiles(files);
    }
  }, [setImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
      processFiles(files);
      e.target.value = '';
    }
  };

  const triggerReplace = (index: number) => {
    setReplaceIndex(index);
    fileInputRefForReplace.current?.click();
  };

  const handleReplaceFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && replaceIndex !== null) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setIsCompressing(true);
        try {
          const compressed = await compressImage(file);
          setImages((prev: string[]) => prev.map((img, i) => i === replaceIndex ? compressed : img));
        } catch (error) {
          console.error("Failed to replace image", error);
          alert("Failed to replace image.");
        } finally {
          setIsCompressing(false);
          setReplaceIndex(null);
        }
      }
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: string[]) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length === 0 ? [""] : filtered;
    });
  };

  const updateUrl = (index: number, url: string) => {
    setImages((prev: string[]) => prev.map((img, i) => i === index ? url : img));
  };

  const addImageUrlInput = () => {
    setImages((prev: string[]) => [...prev, ""]);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone & File Input */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDragging ? "border-[#111] bg-[#111]/5 dark:border-zinc-100 dark:bg-zinc-100/10" : "border-[#EAEAEA] dark:border-zinc-700 bg-[#FAFAFA] dark:bg-zinc-950/50 hover:bg-[#F5F5F5] dark:hover:bg-zinc-900"}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          multiple 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={fileInputRefForReplace} 
          onChange={handleReplaceFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
        
        {isCompressing ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-dark dark:text-brand-light mb-3 animate-spin" />
            <p className="text-sm font-medium text-brand-dark dark:text-zinc-100">Proses gambar...</p>
          </div>
        ) : (
          <>
            <ImagePlus className="w-10 h-10 text-brand-dark dark:text-brand-light mb-3" />
            <p className="text-sm font-medium text-brand-dark dark:text-zinc-100">Klik untuk pilih Berkas Gambar atau Drag & Drop</p>
            <p className="text-xs text-brand-dark dark:text-brand-light mt-1">Gambar akan dioptimasi otomatis</p>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Daftar Gambar Produk</span>
        <button
          type="button"
          onClick={addImageUrlInput}
          className="text-xs font-semibold text-brand-gold hover:text-brand-gold/80 flex items-center gap-1"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>Tambah Kolom URL</span>
        </button>
      </div>

      {/* URL Inputs & Previews */}
      <div className="space-y-3">
        {images.map((img, index) => (
          <div key={index} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 shadow-xs">
            {img && (
              <div className="relative h-12 w-12 shrink-0 rounded-md border border-[#EAEAEA] dark:border-zinc-700 overflow-hidden bg-zinc-100">
                <Image src={img} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            
            {img.startsWith('data:image') ? (
              <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/40 dark:border-emerald-500/10">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">📁 File Gambar Terunggah</span>
                <input type="hidden" name="images" value={img} />
              </div>
            ) : (
              <input 
                type="text" 
                name="images" 
                required 
                value={img} 
                onChange={(e) => updateUrl(index, e.target.value)} 
                placeholder="https://... atau Unggah Gambar" 
                className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-brand-gold/50" 
              />
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                type="button" 
                onClick={() => triggerReplace(index)} 
                className="px-2.5 py-1.5 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 text-[10px] font-bold uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-all text-brand-dark dark:text-zinc-200"
              >
                Ganti
              </button>
              <button 
                type="button" 
                onClick={() => removeImage(index)} 
                className="p-1.5 rounded-lg border border-red-200/20 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                title="Hapus Gambar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
