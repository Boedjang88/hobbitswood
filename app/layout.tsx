import type { Metadata } from "next";
import { Inter, Belleza } from "next/font/google";
import "./tailwind.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import CartDrawer from "@/components/ui/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const belleza = Belleza({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hobbitswood.vercel.app"),
  title: {
    default: "Hobbits Wood",
    template: "%s | Hobbits Wood",
  },
  description:
    "Buat moment berharga dengan figura ekslusif koleksi terbaru kami, etalase kue, etalase makanan, display woodrak susun, rak kayu serbaguna, bingkai kayu.",
  keywords: [
    "figura",
    "figura ekslusif",
    "etalase kue",
    "etalase makanan",
    "display rak susun",
    "rak kayu serbaguna",
    "bingkai kayu"
  ],
  authors: [{ name: "Hobbits Wood Team" }],
  creator: "Hobbits Wood",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Hobbits Wood",
    description: "Buat moment berharga dengan figura ekslusif koleksi terbaru kami, etalase kue, etalase makanan, display woodrak susun, rak kayu serbaguna, bingkai kayu.",
    siteName: "Hobbits Wood",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Hobbits Wood",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hobbits Wood",
    description: "Buat moment berharga dengan figura ekslusif koleksi terbaru kami, etalase kue, etalase makanan, display woodrak susun, rak kayu serbaguna, bingkai kayu.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { prisma } from "@/lib/prisma";

export default async function RootLayout({
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

  return (
    <html lang="id" className={`${inter.variable} ${belleza.variable}`} suppressHydrationWarning>
      <body className="bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <CartDrawer waNumber={waNumberClean} />
        </ThemeProvider>
      </body>
    </html>
  );
}
