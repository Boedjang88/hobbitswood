"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "ALL";

    if (search === currentSearch && status === currentStatus) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (status !== "ALL") {
        params.set("status", status);
      } else {
        params.delete("status");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [search, status, pathname, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative w-full">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-4 sm:w-4 ${isPending ? "text-brand-dark/30 animate-pulse" : "text-brand-dark dark:text-brand-light"}`} />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 sm:pl-9 pr-4 py-3 sm:py-2 bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 dark:text-zinc-100 focus:border-[#EAEAEA] dark:focus:border-zinc-700 focus:ring-2 focus:ring-[#111]/5 dark:focus:ring-zinc-100/10 rounded-xl text-base sm:text-sm transition-all shadow-sm"
        />
      </div>
      <div className="relative shrink-0 w-full sm:w-[150px]">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-4 sm:w-4 text-brand-dark dark:text-brand-light" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full pl-10 sm:pl-9 pr-8 py-3 sm:py-2 appearance-none bg-white dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 dark:text-zinc-100 focus:border-[#EAEAEA] dark:focus:border-zinc-700 focus:ring-2 focus:ring-[#111]/5 dark:focus:ring-zinc-100/10 rounded-xl text-base sm:text-sm transition-all shadow-sm"
        >
          <option value="ALL">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>
    </div>
  );
}
