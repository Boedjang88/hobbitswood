import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import AnimateOnScroll from "@/components/AnimateOnScroll";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAQ — Hobbits Wood",
  description:
    "Pertanyaan yang sering diajukan tentang karya kayu Hobbits Wood. Informasi pemesanan, pengiriman, garansi, dan perawatan.",
};

export default async function FaqPage() {
  const faqCategories = await (prisma as any).faqCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  const settings = await prisma.siteSettings.findFirst();
  const waNumberRaw = settings?.waNumber || "6285811362629";
  let waNumberClean = waNumberRaw.replace(/\D/g, "");
  if (waNumberClean.startsWith("0")) {
    waNumberClean = "62" + waNumberClean.substring(1);
  }

  return (
    <div className="page-enter">
      {/* ═══════ HEADER ═══════ */}
      <section className="bg-brand-cream dark:bg-[#222] pb-16 pt-32 lg:pb-20 lg:pt-40 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <AnimateOnScroll direction="up">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-dark font-medium dark:text-brand-light">
              Bantuan
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl tracking-wide text-brand-dark dark:text-brand-light md:text-6xl">
              Pertanyaan Umum
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-brand-dark font-medium dark:text-brand-light">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang
              produk, pemesanan, dan layanan Hobbits Wood.
            </p>
            <div className="mx-auto mt-6 h-[1px] w-16 bg-brand-gold" />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ FAQ SECTIONS ═══════ */}
      <section className="bg-brand-light dark:bg-brand-dark py-16 lg:py-24 transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {faqCategories.map((category: { id: string; title: string; items: any[] }, index: number) => (
            <AnimateOnScroll
              key={category.title}
              direction="up"
              delay={index * 0.05}
              className={index > 0 ? "mt-16" : ""}
            >
              {/* Category header */}
              <div className="mb-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  className="mt-1 font-serif text-2xl tracking-wide text-brand-dark dark:text-brand-light md:text-3xl"
                  id={`faq-category-${index}`}
                >
                  {category.title}
                </h2>
              </div>

              {/* Accordion */}
              <Accordion items={category.items.map((item: { id: string; question: string; answer: string }) => ({
                id: item.id,
                title: item.question,
                content: item.answer
              }))} />
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════ STILL HAVE QUESTIONS CTA ═══════ */}
      <section
        id="faq-contact-cta"
        className="border-t border-brand-wood/10 bg-brand-cream dark:bg-[#222] py-24 lg:py-32 transition-colors duration-300"
      >
        <AnimateOnScroll direction="up" className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-dark font-medium dark:text-brand-light">
            Belum Menemukan Jawaban?
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-wide text-brand-dark dark:text-brand-light md:text-5xl">
            Hubungi Kami Langsung
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-brand-dark font-medium dark:text-brand-light md:text-base">
            Tim kami siap membantu menjawab pertanyaan Anda seputar produk,
            pesanan custom, atau konsultasi desain interior. Respons cepat
            melalui WhatsApp di jam kerja.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${waNumberClean}?text=Halo%20Hobbits%20Wood%2C%20saya%20ingin%20bertanya%20tentang...`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-faq-whatsapp"
              className="group relative overflow-hidden rounded-full bg-brand-green px-10 py-4 text-sm font-medium tracking-wide text-white transition-all duration-500 hover:bg-brand-green-dark hover:shadow-lg hover:shadow-brand-green/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.432.135.882.162 1.218-.008.497-.254.91-1.019.908-1.316.272-.297.497-.595.67-.89z" />
                </svg>
                Chat WhatsApp
              </span>
              <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
            </a>
            <Link
              href="/shop"
              id="cta-faq-catalog"
              className="rounded-full border border-brand-wood/30 dark:border-brand-light/30 px-10 py-4 text-sm tracking-wide text-brand-dark dark:text-brand-light transition-all duration-500 hover:border-brand-wood hover:bg-brand-light dark:hover:bg-white/10"
            >
              Lihat Katalog
            </Link>
          </div>

          {/* Hours info */}
          <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-brand-wood/10 bg-brand-light dark:bg-[#111] dark:border-brand-light/10 px-6 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
            </span>
            <span className="text-xs text-brand-dark font-medium dark:text-brand-light">
              Senin – Sabtu, 08:00 – 17:00 WIB
            </span>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
