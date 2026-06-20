import { prisma } from "@/lib/prisma";
import FaqManagerClient from "./FaqManagerClient";
import FaqFormsClient from "./FaqFormsClient";

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
        
        {/* Left Col: Add Forms (Client Component) */}
        <div>
          <FaqFormsClient categories={categories} />
        </div>

        {/* Right Col: FAQ manager interface */}
        <div className="lg:col-span-2">
          <FaqManagerClient categories={categories} />
        </div>

      </div>
    </div>
  );
}

