import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import FloatingCart from "@/components/ui/FloatingCart";
import JamOperasionalStatus from "@/components/ui/JamOperasionalStatus";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findFirst();
  const waNumberRaw = settings?.waNumber || "6285811362629";
  let waNumberClean = waNumberRaw.replace(/\D/g, "");
  if (waNumberClean.startsWith("0")) {
    waNumberClean = "62" + waNumberClean.substring(1);
  }
  
  const customOrderWaText = settings?.customOrderWaText || "Halo Hobbits Wood, saya ingin berdiskusi mengenai custom order...";
  const customOrderLink = `https://wa.me/${waNumberClean}?text=${encodeURIComponent(customOrderWaText)}`;
  
  const email = (settings as any)?.email || "muhammadluayyi89@gmail.com";
  const workshop = (settings as any)?.workshop || "Boyolali, Jawa Tengah";
  const instagram = (settings as any)?.instagram || "";
  const tiktok = (settings as any)?.tiktok || "";
  const tokopedia = (settings as any)?.tokopedia || "";
  const shopee = (settings as any)?.shopee || "";
  const jamBuka = (settings as any)?.jamBuka || "Senin - Sabtu, 08:00 - 17:00 WIB";

  return (
    <>
      <Navbar customOrderLink={customOrderLink} waLink={`https://wa.me/${waNumberClean}`} />
      <main>{children}</main>
      <FloatingCart />

      <footer className="border-t border-brand-wood/10 bg-brand-dark text-brand-light mt-16 md:mt-26">
        {/* ─── Mobile Footer (compact) ─── */}
        <div className="md:hidden px-6 pt-14 pb-16 flex flex-col items-center gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/images/hobbits-wood-logo.svg" alt="Hobbits Wood Logo" fill className="object-contain" />
            </div>
            <p className="font-serif font-bold text-sm text-brand-light">Hobbits Wood</p>
            <p className="text-[11px] text-brand-light/40">Pengrajin kayu dari Boyolali</p>
          </div>

          {/* Jam Operasional — hero element */}
          <div className="w-full max-w-xs bg-white/[0.04] border border-brand-gold/20 rounded-2xl px-5 py-5 flex flex-col items-center gap-3">
            {/* Row 1: Label */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold/70 font-bold">Jam Operasional</p>
            </div>
            {/* Row 2: Status dot */}
            <JamOperasionalStatus jamBuka={jamBuka} />
            {/* Row 3: Hari & Jam (parsed) */}
            {(() => {
              const parts = jamBuka.split(",");
              const day = parts[0]?.trim() ?? jamBuka;
              const time = parts[1]?.trim() ?? "";
              return (
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-light leading-tight">{day}</p>
                  {time && <p className="text-xs text-brand-light/60 mt-0.5 font-medium tracking-wide">{time}</p>}
                </div>
              );
            })()}
          </div>

          {/* Contacts — icon + text sejajar, center */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
              <span className="text-xs text-brand-light/70">{workshop}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`https://wa.me/${waNumberClean}`} className="text-xs text-brand-light/70 hover:text-brand-gold transition-colors">
                +{waNumberRaw.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`mailto:${email}`} className="text-xs text-brand-light/70 hover:text-brand-gold transition-colors break-all">{email}</a>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-3">
            {instagram && <a href={instagram} target="_blank" className="p-2 bg-brand-wood/10 rounded-full hover:bg-brand-gold hover:text-white transition-all" aria-label="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg></a>}
            {tiktok && <a href={tiktok} target="_blank" className="p-2 bg-brand-wood/10 rounded-full hover:bg-brand-gold hover:text-white transition-all" aria-label="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg></a>}
            {tokopedia && <a href={tokopedia} target="_blank" className="p-2 bg-brand-wood/10 rounded-full hover:bg-[#42B549] hover:text-white transition-all" aria-label="Tokopedia"><svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M27.043 12.942c-3.43-2.897-16.85-2.247-16.85-2.247l-.473 32.65s17.855.134 23.353 0s9.341-4.508 9.4-7.878s0-24.18 0-24.18c-6.858-.829-11.942-.178-15.43 1.655"/><circle cx="19.531" cy="24.172" r="6.976" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M32.043 29.33a6.272 6.272 0 1 0-2.3-1.786m-19.55-16.849l-4.494 3.252L5.5 39.369l4.22 3.977m23.975-32.251a7.796 7.796 0 0 0-15.318-.299"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M34.396 19.662a2.36 2.36 0 0 1-3.878 2.59a4.194 4.194 0 1 0 3.878-2.59m-13.872.345a2.424 2.424 0 0 1-4.251 2.211a4.31 4.31 0 1 0 4.25-2.21m3.838 11.41c0-2.817 2.031-3.962 4.721-3.962c2.395 0 3.755 3.252 3.755 3.252a18.2 18.2 0 0 1-7.45 1.449a9.9 9.9 0 0 0 5.321 2.542s-.827.62-3.665.62c-2.306.001-2.682-2.453-2.682-3.902"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M30.317 31.569a10.4 10.4 0 0 1-.258 3.008"/></svg></a>}
            {shopee && <a href={shopee} target="_blank" className="p-2 bg-brand-wood/10 rounded-full hover:bg-[#EE4D2D] hover:text-white transition-all" aria-label="Shopee"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z"/></svg></a>}
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-brand-light/25 pt-3 pb-2 border-t border-white/5 w-full text-center">
            &copy; {new Date().getFullYear()} Hobbits Wood · Dibuat dengan ❤️ di Boyolali
          </p>
        </div>


        {/* ─── Desktop Footer ─── */}
        <div className="hidden md:block mx-auto max-w-7xl px-6 pt-20 pb-16 lg:px-8">
          <div className="flex flex-col text-center md:text-left md:flex-row md:justify-between gap-12">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start max-w-sm mx-auto md:mx-0">
              <div className="relative w-48 h-48 mb-4 flex-shrink-0">
                <Image 
                  src="/images/hobbits-wood-logo.svg" 
                  alt="Hobbits Wood Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-brand-light/90">
                Karya pengrajin ahli dari Boyolali.
                <br />
                Setiap potongan kayu bercerita.
              </p>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex flex-col items-start">
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-brand-light">Navigasi</h4>
              <ul className="mt-4 space-y-3 flex flex-col items-start">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Katalog", href: "/shop" },
                  { label: "Cerita Kami", href: "/our-story" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-brand-light/70 transition-colors duration-300 hover:text-brand-gold">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-start w-full md:w-auto">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Hubungi Kami</h4>
              
              <div className="mt-6 flex flex-col gap-6 items-start w-full max-w-md">
                {/* Jam Operasional Card */}
                <div className="w-full bg-white/[0.03] border border-brand-gold/15 hover:border-brand-gold/35 rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none group-hover:bg-brand-gold/10 transition-colors" />
                  <div className="flex items-center gap-4">
                    <span className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold shrink-0">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase tracking-wider text-brand-gold/80 font-bold">Jam Operasional</p>
                        <JamOperasionalStatus jamBuka={jamBuka} />
                      </div>
                      <p className="mt-1 text-sm text-brand-light font-semibold leading-snug">{jamBuka}</p>
                    </div>
                  </div>
                </div>

                {/* Contact cards */}
                <div className="w-full flex flex-col gap-3 text-sm text-brand-light/80">
                  <div className="w-full flex items-start gap-3.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                    <span className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold shrink-0"><MapPin className="w-4 h-4" /></span>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Workshop</p>
                      <p className="mt-0.5 text-xs text-brand-light/95 font-medium leading-relaxed">{workshop}</p>
                    </div>
                  </div>
                  <div className="w-full flex items-start gap-3.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                    <span className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold shrink-0"><Phone className="w-4 h-4" /></span>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">WhatsApp</p>
                      <a href={`https://wa.me/${waNumberClean}`} className="mt-0.5 block text-xs text-brand-light/95 hover:text-brand-gold transition-colors font-medium">
                        +{waNumberRaw.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}
                      </a>
                    </div>
                  </div>
                  <div className="w-full flex items-start gap-3.5 bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
                    <span className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold shrink-0"><Mail className="w-4 h-4" /></span>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Email</p>
                      <a href={`mailto:${email}`} className="mt-0.5 block text-xs text-brand-light/95 hover:text-brand-gold transition-colors font-medium break-all">{email}</a>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-2 flex flex-wrap gap-4 w-full justify-start">
                  {instagram && (
                    <a href={instagram} target="_blank" className="p-2.5 bg-brand-wood/10 rounded-full hover:bg-brand-gold hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
                    </a>
                  )}
                  {tiktok && (
                    <a href={tiktok} target="_blank" className="p-2.5 bg-brand-wood/10 rounded-full hover:bg-brand-gold hover:text-white transition-all transform hover:scale-110" aria-label="TikTok">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
                    </a>
                  )}
                  {tokopedia && (
                    <a href={tokopedia} target="_blank" className="p-2.5 bg-brand-wood/10 rounded-full hover:bg-[#42B549] hover:text-white transition-all transform hover:scale-110 flex items-center justify-center" aria-label="Tokopedia">
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M27.043 12.942c-3.43-2.897-16.85-2.247-16.85-2.247l-.473 32.65s17.855.134 23.353 0s9.341-4.508 9.4-7.878s0-24.18 0-24.18c-6.858-.829-11.942-.178-15.43 1.655"/>
                        <circle cx="19.531" cy="24.172" r="6.976" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M32.043 29.33a6.272 6.272 0 1 0-2.3-1.786m-19.55-16.849l-4.494 3.252L5.5 39.369l4.22 3.977m23.975-32.251a7.796 7.796 0 0 0-15.318-.299"/>
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M34.396 19.662a2.36 2.36 0 0 1-3.878 2.59a4.194 4.194 0 1 0 3.878-2.59m-13.872.345a2.424 2.424 0 0 1-4.251 2.211a4.31 4.31 0 1 0 4.25-2.21m3.838 11.41c0-2.817 2.031-3.962 4.721-3.962c2.395 0 3.755 3.252 3.755 3.252a18.2 18.2 0 0 1-7.45 1.449a9.9 9.9 0 0 0 5.321 2.542s-.827.62-3.665.62c-2.306.001-2.682-2.453-2.682-3.902"/>
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M30.317 31.569a10.4 10.4 0 0 1-.258 3.008"/>
                      </svg>
                    </a>
                  )}
                  {shopee && (
                    <a href={shopee} target="_blank" className="p-2.5 bg-brand-wood/10 rounded-full hover:bg-[#EE4D2D] hover:text-white transition-all transform hover:scale-110 flex items-center justify-center" aria-label="Shopee">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-light/10 pt-8 md:flex-row">
            <p className="text-xs text-brand-light/70 font-medium">
              &copy; {new Date().getFullYear()} Hobbits Wood. Hak cipta dilindungi.
            </p>
            <p className="text-xs text-brand-light/70 font-medium">
              Dibuat dengan ❤️ di Boyolali
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
