"use client";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Trash2, UploadCloud, ImagePlus, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

export default function DragDropUploader({ images, setImages }: { images: string[], setImages: any }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Reset input so the same file can be selected again if needed
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
        {isCompressing ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-dark dark:text-brand-light mb-3 animate-spin" />
            <p className="text-sm font-medium text-brand-dark dark:text-zinc-100">Compressing images...</p>
          </div>
        ) : (
          <>
            <ImagePlus className="w-10 h-10 text-brand-dark dark:text-brand-light mb-3" />
            <p className="text-sm font-medium text-brand-dark dark:text-zinc-100">Click to open File Explorer or Drag & Drop</p>
            <p className="text-xs text-brand-dark dark:text-brand-light mt-1">Images will be automatically compressed before saving</p>
          </>
        )}
      </div>

      {/* URL Inputs & Previews */}
      <div className="space-y-3">
        {images.map((img, index) => (
          <div key={index} className="flex items-center gap-3">
            <input 
              type="text" 
              name="images" 
              required 
              value={img} 
              onChange={(e) => updateUrl(index, e.target.value)} 
              placeholder="https://... or Upload Image" 
              className="flex-1 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100" 
              readOnly={img.startsWith('data:image')}
            />
            {images.length > 1 && (
              <button type="button" onClick={() => removeImage(index)} className="p-2 text-brand-dark dark:text-brand-light hover:text-red-600 dark:hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {img && (
              <div className="relative h-10 w-10 shrink-0 rounded border border-[#EAEAEA] dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
                <Image src={img} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
