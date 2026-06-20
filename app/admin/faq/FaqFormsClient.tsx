"use client";

import { useState } from "react";
import { addFaqCategory, addFaqItem } from "@/lib/actions/faq";
import { Plus, HelpCircle, Folder, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: string;
  title: string;
};

type Props = {
  categories: Category[];
};

export default function FaqFormsClient({ categories }: Props) {
  const [isCategoryPending, setIsCategoryPending] = useState(false);
  const [isItemPending, setIsItemPending] = useState(false);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;

    if (!title.trim()) {
      toast.error("Judul kategori tidak boleh kosong!");
      return;
    }

    setIsCategoryPending(true);
    try {
      await addFaqCategory(formData);
      toast.success(`Kategori "${title}" berhasil ditambahkan!`, {
        icon: "✨",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan kategori.");
    } finally {
      setIsCategoryPending(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const question = formData.get("question") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!categoryId) {
      toast.error("Silakan pilih kategori!");
      return;
    }

    setIsItemPending(true);
    try {
      await addFaqItem(formData);
      toast.success("Pertanyaan FAQ berhasil ditambahkan!", {
        icon: "✨",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan pertanyaan FAQ.");
    } finally {
      setIsItemPending(false);
    }
  };

  return (
    <div className="space-y-8 lg:sticky lg:top-8">
      {/* Add Category Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 transition-colors duration-300">
        <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5 text-brand-dark dark:text-brand-light" />
          Add Category
        </h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all"
              placeholder="e.g. Shipping & Returns"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Order</label>
            <input
              type="number"
              name="order"
              defaultValue={0}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isCategoryPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all shadow-sm disabled:opacity-50"
          >
            {isCategoryPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span>Menambahkan...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Add FAQ Item Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 transition-colors duration-300">
        <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-dark dark:text-brand-light" />
          Add Question
        </h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Category</label>
            <select
              name="categoryId"
              required
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Question</label>
            <input
              type="text"
              name="question"
              required
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all"
              placeholder="e.g. How long does shipping take?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Answer</label>
            <textarea
              name="answer"
              required
              rows={4}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all resize-none"
              placeholder="Detailed answer..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1.5">Order</label>
            <input
              type="number"
              name="order"
              defaultValue={0}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] dark:bg-zinc-950 border border-transparent dark:border-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#EAEAEA] dark:focus:border-zinc-700 rounded-xl text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isItemPending || categories.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all shadow-sm disabled:opacity-50"
          >
            {isItemPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span>Menambahkan...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
