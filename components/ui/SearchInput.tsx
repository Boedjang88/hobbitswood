"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, Suspense } from "react";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

function SearchInputInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  // Sync from URL on external navigation
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (searchParams.get("q") || "")) {
        startTransition(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (query.trim()) {
            params.set("q", query.trim());
          } else {
            params.delete("q");
          }
          router.push(`/shop?${params.toString()}`);
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="relative mx-auto max-w-md">
      <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark font-medium dark:text-brand-light" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
        id="shop-search-input"
        className="w-full rounded-full border border-brand-wood/20 bg-white dark:bg-[#222] py-3 pl-11 pr-10 text-sm text-brand-dark dark:text-brand-light placeholder-brand-dark/50 dark:placeholder-brand-light/50 outline-none transition-all duration-300 focus:border-brand-wood focus:ring-2 focus:ring-brand-wood/10"
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-wood border-t-transparent" />
        </div>
      )}
    </div>
  );
}

export default function SearchInput() {
  return (
    <Suspense
      fallback={
        <div className="relative mx-auto max-w-md">
          <div className="h-12 w-full animate-pulse rounded-full border border-brand-wood/20 bg-white dark:bg-[#222]" />
        </div>
      }
    >
      <SearchInputInner />
    </Suspense>
  );
}
