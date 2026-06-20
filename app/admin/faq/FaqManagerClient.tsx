"use client";

import { useState } from "react";
import { deleteFaqItem, deleteFaqCategory } from "@/lib/actions/faq";
import { Trash2, Search, HelpCircle, ChevronDown, ChevronUp, Folder } from "lucide-react";
import { toast } from "sonner";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  categoryId: string;
};

type Category = {
  id: string;
  title: string;
  order: number;
  items: FaqItem[];
};

type Props = {
  categories: Category[];
};

export default function FaqManagerClient({ categories }: Props) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Flatten all items for the "All" view
  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryTitle: cat.title,
    }))
  );

  // Filter items based on active category tab and search query
  const filteredItems = (
    activeTab === "ALL"
      ? allItems
      : categories
          .find((cat) => cat.id === activeTab)
          ?.items.map((item) => ({ ...item, categoryTitle: "" })) || []
  ).filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
      const promise = deleteFaqItem(id);
      toast.promise(promise, {
        loading: "Menghapus pertanyaan...",
        success: "Pertanyaan berhasil dihapus!",
        error: "Gagal menghapus pertanyaan.",
      });
    }
  };

  const handleDeleteCategory = async (id: string, title: string) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus kategori "${title}"? Semua pertanyaan di dalam kategori ini juga akan terhapus.`
      )
    ) {
      const promise = deleteFaqCategory(id);
      toast.promise(promise, {
        loading: "Menghapus kategori...",
        success: "Kategori berhasil dihapus!",
        error: "Gagal menghapus kategori.",
      });
      if (activeTab === id) {
        setActiveTab("ALL");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
        <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-none snap-x">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 snap-start transition-all ${
              activeTab === "ALL"
                ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                : "text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
            }`}
          >
            Semua ({allItems.length})
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="relative group shrink-0 snap-start">
              <button
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all pr-10 ${
                  activeTab === cat.id
                    ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                    : "text-brand-dark dark:text-brand-light hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
                }`}
              >
                {cat.title} ({cat.items.length})
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id, cat.title)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus Kategori"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 overflow-hidden flex flex-col transition-colors duration-300">
        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-dark dark:text-brand-light" />
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100">
              {activeTab === "ALL"
                ? "Semua FAQ"
                : categories.find((c) => c.id === activeTab)?.title || "FAQ"}
            </h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Cari pertanyaan atau jawaban..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* FAQ Table (Desktop & Tablet View) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFAFA]/30 dark:bg-zinc-950/30 text-xs text-brand-dark dark:text-brand-light border-b border-[#EAEAEA] dark:border-zinc-800 uppercase tracking-wider">
                <th className="p-4 font-semibold pl-6 w-1/3">Pertanyaan</th>
                <th className="p-4 font-semibold w-1/3">Jawaban</th>
                {activeTab === "ALL" && <th className="p-4 font-semibold">Kategori</th>}
                <th className="p-4 font-semibold">Urutan</th>
                <th className="p-4 font-semibold text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#EAEAEA]/50 dark:divide-zinc-800/50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "ALL" ? 5 : 4}
                    className="p-8 text-center text-brand-dark dark:text-brand-light"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <HelpCircle className="w-8 h-8 opacity-20" />
                      <p>Tidak ada FAQ ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isExpanded = !!expandedItems[item.id];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAFAFA] dark:hover:bg-zinc-800/20 transition-colors group align-top"
                    >
                      {/* Question */}
                      <td className="p-4 pl-6 font-medium text-brand-dark dark:text-zinc-100 max-w-[240px] whitespace-normal leading-relaxed">
                        {item.question}
                      </td>
                      
                      {/* Answer */}
                      <td className="p-4 text-brand-dark dark:text-brand-light max-w-[320px] whitespace-normal leading-relaxed">
                        <div>
                          <p className={isExpanded ? "" : "line-clamp-2"}>{item.answer}</p>
                          {item.answer.length > 100 && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="mt-1 text-xs font-semibold text-brand-dark dark:text-zinc-300 hover:underline flex items-center gap-1"
                            >
                              {isExpanded ? (
                                <>
                                  Tutup <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  Selengkapnya <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Category Title */}
                      {activeTab === "ALL" && (
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-brand-dark dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            <Folder className="w-3 h-3" />
                            {item.categoryTitle}
                          </span>
                        </td>
                      )}

                      {/* Order */}
                      <td className="p-4 font-semibold text-brand-dark dark:text-brand-light">
                        {item.order}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex p-2 text-brand-dark dark:text-brand-light hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                          title="Hapus Pertanyaan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FAQ Mobile View Card List */}
        <div className="block sm:hidden divide-y divide-[#EAEAEA] dark:divide-zinc-800">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-brand-dark dark:text-brand-light">
              <HelpCircle className="w-8 h-8 opacity-20 mx-auto mb-2" />
              <p>Tidak ada FAQ ditemukan.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = !!expandedItems[item.id];
              return (
                <div key={item.id} className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="p-1.5 bg-brand-gold/10 text-brand-gold rounded-lg shrink-0 mt-0.5"><HelpCircle className="w-4 h-4" /></span>
                      <h4 className="font-semibold text-sm text-brand-dark dark:text-zinc-100 leading-snug">{item.question}</h4>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                      title="Hapus Pertanyaan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-brand-dark/80 dark:text-brand-light/80 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850">
                    <p className={isExpanded ? "" : "line-clamp-3 leading-relaxed"}>{item.answer}</p>
                    {item.answer.length > 80 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="mt-1.5 text-[10px] font-bold text-brand-dark dark:text-zinc-300 hover:underline flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>Tutup <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Selengkapnya <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-brand-dark/50 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    {activeTab === "ALL" && item.categoryTitle ? (
                      <span className="flex items-center gap-1">
                        <Folder className="w-3 h-3 text-brand-gold" />
                        <span>Kategori: {item.categoryTitle}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <span>Urutan: {item.order}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
