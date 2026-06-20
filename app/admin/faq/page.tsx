import { prisma } from "@/lib/prisma";
import { addFaqCategory, addFaqItem } from "@/lib/actions/faq";
import { Plus, HelpCircle, Folder } from "lucide-react";
import FaqManagerClient from "./FaqManagerClient";

export default async function AdminFaqPage() {
  const categories = await prisma.faqCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100">FAQ Management</h1>
          <p className="text-brand-dark dark:text-brand-light text-sm mt-1">Manage categories and questions for your help center.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Col: Add Forms */}
        <div className="space-y-8 lg:sticky lg:top-8">
          
          {/* Add Category Form */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 transition-colors duration-300">
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-brand-dark dark:text-brand-light" />
              Add Category
            </h2>
            <form action={addFaqCategory} className="space-y-4">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </form>
          </div>

          {/* Add FAQ Item Form */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 transition-colors duration-300">
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-dark dark:text-brand-light" />
              Add Question
            </h2>
            <form action={addFaqItem} className="space-y-4">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all shadow-sm"
                disabled={categories.length === 0}
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </form>
          </div>

        </div>

        {/* Right Col: FAQ manager interface */}
        <div className="lg:col-span-2">
          <FaqManagerClient categories={categories} />
        </div>

      </div>
    </div>
  );
}
