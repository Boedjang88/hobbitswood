"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, ChevronLeft, ChevronRight, Award } from "lucide-react";

type LeaderboardProduct = {
  id: string;
  name: string;
  views: number;
  images: string;
};

type Props = {
  products: LeaderboardProduct[];
};

export default function LeaderboardClient({ products }: Props) {
  const [pageSize, setPageSize] = useState<number | "ALL">(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Parse primary image for preview
  const getPrimaryImage = (imagesStr: string) => {
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) && parsed.length > 0 && parsed[0] ? parsed[0] : "/images/hero.jpg";
    } catch {
      return "/images/hero.jpg";
    }
  };

  // Products are pre-sorted descending by views from the database query
  const sortedProducts = products;

  // Pagination calculation
  const totalItems = sortedProducts.length;
  const actualPageSize = pageSize === "ALL" ? totalItems : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / actualPageSize));
  const activePage = pageSize === "ALL" ? 1 : Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * actualPageSize;
  const endIndex = Math.min(startIndex + actualPageSize, totalItems);
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageSizeChange = (val: string) => {
    if (val === "ALL") {
      setPageSize("ALL");
    } else {
      setPageSize(parseInt(val));
    }
    setCurrentPage(1);
  };

  // Helper for rank colors/badges
  const getRankBadgeStyle = (globalRank: number) => {
    if (globalRank === 1) {
      return {
        bg: "bg-amber-500 text-white font-extrabold ring-4 ring-amber-500/20 scale-110",
        card: "border-l-4 border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10",
        label: "🏆 Juara 1",
        labelColor: "text-amber-600 dark:text-amber-400 font-serif font-bold text-xs"
      };
    }
    if (globalRank === 2) {
      return {
        bg: "bg-slate-400 text-white font-bold ring-4 ring-slate-400/20",
        card: "border-l-4 border-l-slate-400 bg-slate-400/5 dark:bg-slate-400/10",
        label: "🥈 Juara 2",
        labelColor: "text-slate-600 dark:text-slate-400 font-serif font-bold text-xs"
      };
    }
    if (globalRank === 3) {
      return {
        bg: "bg-amber-700 text-white font-bold ring-4 ring-amber-700/20",
        card: "border-l-4 border-l-amber-700 bg-amber-700/5 dark:bg-amber-700/10",
        label: "🥉 Juara 3",
        labelColor: "text-amber-800 dark:text-amber-500 font-serif font-bold text-xs"
      };
    }
    if (globalRank <= 5) {
      return {
        bg: "bg-teal-500/25 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400",
        card: "border-l-4 border-l-teal-500/60 bg-teal-50/20 dark:bg-teal-950/10",
        label: "Top 5",
        labelColor: "text-teal-600 dark:text-teal-400 font-bold text-[10px]"
      };
    }
    if (globalRank <= 10) {
      return {
        bg: "bg-indigo-500/25 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400",
        card: "border-l-4 border-l-indigo-500/40 bg-indigo-50/10 dark:bg-indigo-950/5",
        label: "Top 10",
        labelColor: "text-indigo-600 dark:text-indigo-400 font-bold text-[10px]"
      };
    }
    return {
      bg: "bg-gray-100 dark:bg-zinc-800 text-brand-dark dark:text-brand-light",
      card: "border-l border-l-[#EAEAEA] dark:border-l-zinc-800",
      label: null,
      labelColor: ""
    };
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 overflow-hidden flex flex-col h-full transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Top Viewed Products
          </h2>
          <p className="text-xs text-brand-dark/60 dark:text-zinc-400 mt-0.5">Urutan berdasarkan jumlah penayangan toko</p>
        </div>

        {/* View Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-dark dark:text-brand-light">Tampilkan:</span>
          <select
            value={pageSize.toString()}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="px-2 py-1 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 rounded-lg text-xs outline-none dark:text-zinc-100 font-semibold"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="ALL">Semua</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {totalItems === 0 ? (
          <p className="text-sm text-brand-dark dark:text-brand-light text-center py-6">Belum ada data produk</p>
        ) : (
          paginatedProducts.map((p, index) => {
            const globalRank = startIndex + index + 1;
            const rankStyle = getRankBadgeStyle(globalRank);
            return (
              <div
                key={p.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${rankStyle.card}`}
              >
                {/* Rank Badge */}
                <div
                  className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-xs font-bold transition-all ${rankStyle.bg}`}
                >
                  {globalRank}
                </div>

                {/* Image */}
                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700 bg-white">
                  <Image
                    src={getPrimaryImage(p.images)}
                    alt={p.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h4 className="font-semibold text-sm text-brand-dark dark:text-zinc-100 truncate flex-1 min-w-[120px]">
                      {p.name}
                    </h4>
                    {rankStyle.label && (
                      <span className={rankStyle.labelColor}>{rankStyle.label}</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-dark dark:text-brand-light flex items-center gap-1 mt-0.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-brand-dark/50 dark:text-brand-light/50" />
                    {p.views.toLocaleString("id-ID")} views
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {pageSize !== "ALL" && totalPages > 1 && (
        <div className="p-4 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/30 dark:bg-zinc-950/30 flex items-center justify-between">
          <span className="text-xs text-brand-dark dark:text-brand-light">
            Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} produk
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 dark:text-zinc-100" />
            </button>
            <span className="text-xs font-semibold px-3 dark:text-zinc-100">
              {activePage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 dark:text-zinc-100" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
