"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/actions";
import JamOperasionalPicker from "@/components/admin/JamOperasionalPicker";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
  settings: {
    promoText: string;
    waNumber: string;
    customOrderWaText: string;
    email: string;
    workshop: string;
    instagram: string;
    tiktok: string;
    tokopedia: string;
    shopee: string;
    jamBuka: string;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!window.confirm("Apakah Anda yakin ingin menyimpan perubahan pengaturan situs ini?")) {
      return;
    }

    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateSiteSettings(formData);
      toast.success("Pengaturan situs berhasil disimpan!", {
        icon: "✨",
        description: "Perubahan telah diterapkan ke seluruh halaman website."
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan pengaturan situs.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="promoText" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
          Promo Marquee Text
        </label>
        <input
          type="text"
          name="promoText"
          id="promoText"
          defaultValue={settings.promoText}
          className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
          Jam Operasional
        </label>
        <JamOperasionalPicker defaultValue={settings.jamBuka || "Senin - Sabtu, 08:00 - 17:00 WIB"} />
      </div>

      <div>
        <label htmlFor="waNumber" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
          WhatsApp Number (Checkout)
        </label>
        <input
          type="text"
          name="waNumber"
          id="waNumber"
          defaultValue={settings.waNumber}
          className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          required
        />
        <p className="mt-2 text-xs text-brand-dark dark:text-brand-light">Include country code without +, e.g., 628123456789</p>
      </div>

      <div>
        <label htmlFor="customOrderWaText" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
          Custom Order WA Template
        </label>
        <textarea
          name="customOrderWaText"
          id="customOrderWaText"
          rows={4}
          defaultValue={settings.customOrderWaText || "Halo Hobbits Wood, saya ingin berdiskusi mengenai custom order..."}
          className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600 resize-none"
          required
        ></textarea>
      </div>

      <div className="pt-4 pb-2 border-t border-[#EAEAEA] dark:border-zinc-800">
        <h3 className="text-lg font-bold text-brand-dark dark:text-zinc-100">Contact & Social Links</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={settings.email || "muhammadluayyi89@gmail.com"}
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
            required
          />
        </div>

        <div>
          <label htmlFor="workshop" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            Workshop Location
          </label>
          <input
            type="text"
            name="workshop"
            id="workshop"
            defaultValue={settings.workshop || "Boyolali, Jawa Tengah"}
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
            required
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            Instagram URL
          </label>
          <input
            type="url"
            name="instagram"
            id="instagram"
            defaultValue={settings.instagram || ""}
            placeholder="https://instagram.com/..."
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="tiktok" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            TikTok URL
          </label>
          <input
            type="url"
            name="tiktok"
            id="tiktok"
            defaultValue={settings.tiktok || ""}
            placeholder="https://tiktok.com/@..."
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="tokopedia" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            Tokopedia URL
          </label>
          <input
            type="url"
            name="tokopedia"
            id="tokopedia"
            defaultValue={settings.tokopedia || ""}
            placeholder="https://tokopedia.com/..."
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="shopee" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
            Shopee URL
          </label>
          <input
            type="url"
            name="shopee"
            id="shopee"
            defaultValue={settings.shopee || ""}
            placeholder="https://shopee.co.id/..."
            className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[#EAEAEA] dark:border-zinc-800">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white dark:text-zinc-900 bg-[#111] dark:bg-zinc-100 hover:bg-[#333] dark:hover:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
