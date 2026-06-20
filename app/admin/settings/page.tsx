import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "@/lib/actions";
import Link from "next/link";
import { Settings, ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst() || {
    promoText: "Free Shipping across Java & Bali",
    waNumber: "628123456789",
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
        <form action={updateSiteSettings} className="space-y-6">
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
            <p className="mt-2 text-xs text-brand-dark dark:text-brand-light">This text appears scrolling at the very top of the website.</p>
          </div>

          <div>
            <label htmlFor="jamBuka" className="block text-sm font-medium text-brand-dark dark:text-zinc-100 mb-2">
              Jam Operasional
            </label>
            <input
              type="text"
              name="jamBuka"
              id="jamBuka"
              defaultValue={(settings as any).jamBuka || "Senin - Sabtu, 08:00 - 17:00 WIB"}
              className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
              required
            />
            <p className="mt-2 text-xs text-brand-dark dark:text-brand-light">Muncul di halaman footer untuk semua pengunjung.</p>
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
              defaultValue={(settings as any).customOrderWaText || "Halo Hobbits Wood, saya ingin berdiskusi mengenai custom order..."}
              className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600 resize-none"
              required
            ></textarea>
            <p className="mt-2 text-xs text-brand-dark dark:text-brand-light">Default text when users click "Custom Order".</p>
          </div>

          <div className="pt-4 pb-2 border-t border-[#EAEAEA] dark:border-zinc-800">
            <h3 className="text-lg font-bold text-brand-dark dark:text-zinc-100">Contact & Social Links</h3>
            <p className="text-xs text-brand-dark dark:text-brand-light mt-1">These details will appear in the global footer.</p>
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
                defaultValue={(settings as any).email || "muhammadluayyi89@gmail.com"}
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
                defaultValue={(settings as any).workshop || "Boyolali, Jawa Tengah"}
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
                defaultValue={(settings as any).instagram || ""}
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
                defaultValue={(settings as any).tiktok || ""}
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
                defaultValue={(settings as any).tokopedia || ""}
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
                defaultValue={(settings as any).shopee || ""}
                placeholder="https://shopee.co.id/..."
                className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none transition-all text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-600 focus:ring-2 focus:ring-[#111]/10 dark:focus:ring-zinc-100/10 placeholder-[#999] dark:placeholder-zinc-600"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAEAEA] dark:border-zinc-800">
            <button
              type="submit"
              className="w-full sm:w-auto flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white dark:text-zinc-900 bg-[#111] dark:bg-zinc-100 hover:bg-[#333] dark:hover:bg-white focus:outline-none transition-all"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
