"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  const parseJsonSafe = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "";
    } catch {
      return "";
    }
  };

  const primaryImage = parseJsonSafe(product.images);
  const primaryMaterial = parseJsonSafe(product.materials);
  const primaryVariant = parseJsonSafe(product.dimensions);

  return (
    <Link href={`/product/${product.slug}`} className="group block relative">
      <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-lg">
        <Image
          src={primaryImage || "/images/hero.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10 dark:group-hover:bg-black/40" />
        
        {/* Hover Actions Layer (Desktop Only) */}
        <div className="hidden lg:flex absolute bottom-4 right-4 flex-col gap-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black text-brand-dark dark:text-white shadow-lg hover:scale-110 transition-transform">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-1 items-start">
        <h3 className="font-serif text-base lg:text-lg font-medium text-brand-dark dark:text-white line-clamp-1 w-full">{product.name}</h3>
        <p className="text-xs lg:text-sm text-brand-dark/70 dark:text-brand-light/70 truncate w-full">
          {product.category} {primaryMaterial ? `• ${primaryMaterial}` : ""}
        </p>
        
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm lg:text-lg font-medium text-brand-wood dark:text-brand-gold">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
