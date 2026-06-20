import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Settings, ArrowLeft } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst() || {
    promoText: "Free Shipping across Java & Bali",
    waNumber: "628123456789",
    customOrderWaText: "Halo Hobbits Wood, saya ingin berdiskusi mengenai custom order...",
    email: "muhammadluayyi89@gmail.com",
    workshop: "Boyolali, Jawa Tengah",
    instagram: "",
    tiktok: "",
    tokopedia: "",
    shopee: "",
    jamBuka: "Senin - Sabtu, 08:00 - 17:00 WIB"
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-2 text-sm text-brand-dark dark:text-brand-light transition-colors hover:text-brand-dark dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100 flex items-center gap-3">
          <Settings className="w-6 h-6 text-brand-dark dark:text-brand-light" />
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-brand-dark dark:text-brand-light">
          Manage global site configurations.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}

