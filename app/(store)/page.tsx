import ScrollDrivenHero from "@/components/ScrollDrivenHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/StaggeredGrid";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Check, Hammer, Clock, Truck, ShieldCheck, Leaf, Star, Quote } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import PageEntranceSplash from "@/components/PageEntranceSplash";
import LocationAndReviews from "@/components/LocationAndReviews";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const settings = await prisma.siteSettings.findFirst();
  const waNumberRaw = settings?.waNumber || "6285811362629";
  let waNumberClean = waNumberRaw.replace(/\D/g, "");
  if (waNumberClean.startsWith("0")) {
    waNumberClean = "62" + waNumberClean.substring(1);
  }

  return (
    <main className="bg-brand-light dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <PageEntranceSplash />
      <ScrollDrivenHero />

      {/* Value Proposition Section */}
      <section className="py-16 md:py-20 bg-brand-wood text-brand-light px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 text-center">
          <AnimateOnScroll direction="up" delay={0}>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mb-5 md:mb-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Check className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">100% Kayu Solid</h3>
              <p className="text-brand-light/70 text-sm leading-relaxed max-w-xs mx-auto">Menggunakan material kayu Jati dan Sungkai pilihan kualitas ekspor.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={0.15}>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mb-5 md:mb-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Hammer className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">Handcrafted</h3>
              <p className="text-brand-light/70 text-sm leading-relaxed max-w-xs mx-auto">Dibuat langsung oleh tangan-tangan pengrajin lokal berpengalaman puluhan tahun.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={0.3}>
            <div className="flex flex-col items-center sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 mb-5 md:mb-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Clock className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">Desain Tak Lekang Waktu</h3>
              <p className="text-brand-light/70 text-sm leading-relaxed max-w-xs mx-auto">Estetika minimalis yang dirancang untuk cocok dengan berbagai zaman.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Latest Collection */}
      <section className="relative z-10 py-20 md:py-32 px-6 lg:px-12 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll direction="up" className="text-center mb-14 md:mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">Koleksi Terbaru</p>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-dark dark:text-brand-light mb-4">
              Latest Collection
            </h2>
            <p className="text-brand-dark font-medium dark:text-brand-light max-w-2xl mx-auto text-sm md:text-base">
              Setiap produk dikurasi dengan detail tinggi, memastikan bentuk dan fungsi berjalan beriringan.
            </p>
          </AnimateOnScroll>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
            {products.map((product: any) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <AnimateOnScroll direction="up" delay={0.2}>
            <div className="mt-12 md:mt-16 text-center">
              <Link href="/shop" className="inline-block px-8 py-3 md:py-4 border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light hover:bg-brand-dark hover:text-brand-light dark:hover:bg-brand-light dark:hover:text-brand-dark transition-colors duration-300 tracking-wide text-sm font-medium rounded-sm">
                LIHAT SEMUA KOLEKSI
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why Choose Us — Trust Badges */}
      <section className="py-16 md:py-24 px-6 bg-brand-cream dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll direction="up" className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">Mengapa Hobbits Wood</p>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-dark dark:text-brand-light">
              Kenapa Pelanggan Memilih Kami
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, title: "Gratis Ongkir", desc: "Area Bekasi & Jakarta, pengiriman dengan armada sendiri." },
              { icon: ShieldCheck, title: "Garansi 5 Tahun", desc: "Jaminan kualitas struktur dan finishing furnitur Anda." },
              { icon: Leaf, title: "Ramah Lingkungan", desc: "Kayu bersertifikat SVLK, menanam 5 bibit untuk setiap pohon." },
              { icon: Hammer, title: "Custom Order", desc: "Desain sesuai keinginan Anda, dikerjakan pengrajin profesional." },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} direction="up" delay={i * 0.1} className="h-full">
                <div className="h-full flex flex-col items-center text-center p-6 md:p-8 rounded-lg bg-brand-light dark:bg-brand-dark border border-brand-wood/10 dark:border-brand-light/10 hover:border-brand-gold/40 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base md:text-lg font-serif text-brand-dark dark:text-brand-light mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-dark font-medium dark:text-brand-light leading-relaxed flex-1">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-20 md:py-32 px-6 lg:px-12 bg-brand-wood dark:bg-black text-brand-light transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <AnimateOnScroll direction="left" className="flex-1 space-y-6 text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">Penawaran Spesial</p>
              <h2 className="text-3xl md:text-5xl font-serif">Shop The Look</h2>
              <p className="text-brand-light/70 leading-relaxed text-base md:text-lg">
                Koleksi ruangan lengkap yang dikurasi oleh desainer interior kami. Dapatkan penawaran khusus untuk pembelian satu set bundling.
              </p>
              <div>
                <Link href="/shop" className="inline-block px-8 py-3 md:py-4 bg-brand-gold text-brand-dark hover:bg-brand-light transition-colors text-sm font-bold tracking-wide rounded-sm">
                  LIHAT BUNDLING
                </Link>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll direction="right" className="flex-1 w-full">
              <div className="relative h-[350px] md:h-[500px] lg:h-[600px] w-full bg-brand-dark rounded-sm overflow-hidden shadow-2xl group">
                <Image src="/images/hero.jpg" alt="Shop the look bundle" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof Section */}
      <section className="py-20 md:py-32 px-6 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll direction="up" className="text-center mb-16 md:mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">Kisah Pelanggan</p>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-dark dark:text-brand-light">
              Apa Kata Mereka
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                text: "Kualitas kayunya luar biasa. Finishing sangat rapi dan tekstur kayunya masih terasa alami. Sangat puas dengan meja makan pesanan saya.",
                name: "Budi Santoso",
                role: "Pemilik Cafe, Jakarta",
              },
              {
                text: "Pesan lemari pakaian custom dan hasilnya melebihi ekspektasi. Tim Woodcraft sangat sabar melayani revisi desain. Recommended!",
                name: "Sarah Wijaya",
                role: "Ibu Rumah Tangga, Bekasi",
              },
              {
                text: "Sangat profesional dari awal konsultasi sampai instalasi. Kursi jatinya kokoh banget dan desainnya minimalis cocok untuk rumah modern.",
                name: "Rizky Pratama",
                role: "Arsitek, Depok",
              },
            ].map((testi, i) => (
              <AnimateOnScroll key={i} direction="up" delay={i * 0.2}>
                <div className="relative p-8 md:p-10 bg-brand-cream dark:bg-zinc-900 rounded-sm shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-gold/20 dark:text-brand-gold/10" />
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-brand-dark dark:text-brand-light italic leading-relaxed mb-8 flex-1">
                    "{testi.text}"
                  </p>
                  <div>
                    <p className="font-serif text-brand-dark dark:text-brand-light font-semibold">{testi.name}</p>
                    <p className="text-xs text-brand-dark font-medium dark:text-brand-light mt-1 uppercase tracking-wider">{testi.role}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Location and Reviews Section */}
      <LocationAndReviews />

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 px-6 bg-brand-cream dark:bg-zinc-900 transition-colors duration-300">
        <AnimateOnScroll direction="up" className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-4">Mulai Sekarang</p>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-dark dark:text-brand-light mb-6 leading-tight">
            Siap Menghadirkan Kehangatan Di Rumah Anda?
          </h2>
          <p className="text-brand-dark font-medium dark:text-brand-light mb-10 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Konsultasikan kebutuhan furniture Anda dengan tim kami. Gratis konsultasi untuk desain custom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${waNumberClean}?text=Halo%20Hobbits%20Wood%2C%20saya%20tertarik%20dengan%20karya%20kayu%20Anda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 md:py-4 bg-brand-green text-white hover:bg-brand-green-dark transition-colors text-sm font-medium tracking-wide rounded-full shadow-lg hover:shadow-xl hover:shadow-brand-green/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.432.135.882.162 1.218-.008.497-.254.91-1.019.908-1.316.272-.297.497-.595.67-.89z" />
              </svg>
              Chat WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 md:py-4 border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light hover:bg-brand-dark hover:text-brand-light dark:hover:bg-brand-light dark:hover:text-brand-dark transition-colors duration-300 text-sm font-medium tracking-wide rounded-full"
            >
              Lihat Katalog
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
}
