import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { incrementProductView } from "@/lib/actions";
import { formatCurrency, safeUri } from "@/lib/utils";
import ProductClientView from "@/components/ProductClientView";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ─── Data Fetching ───────────────────────────────────────
const getProduct = cache(async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: { links: true },
  });
});

const getRelatedProducts = cache(async (category: string, currentSlug: string) => {
  return await prisma.product.findMany({
    where: {
      category,
      slug: { not: currentSlug },
      isDeleted: false,
      status: "PUBLISHED"
    },
    take: 3,
    orderBy: { views: "desc" }
  });
});

// ─── Dynamic Metadata ───────────────────────────────────
export async function generateMetadata(
  props: ProductPageProps
): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.slug);
  if (!product) return { title: "Produk Tidak Ditemukan — Hobbits Wood" };
  
  let primaryImage = "";
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) primaryImage = parsed[0];
  } catch {}

  return {
    title: `${product.name} — Hobbits Wood`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Hobbits Wood`,
      description: product.description.slice(0, 160),
      images: [primaryImage],
    },
  };
}

// ─── Page Component ─────────────────────────────────────
export default async function ProductDetailPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product || product.isDeleted) notFound();

  // Fire-and-forget view counter (no await needed)
  incrementProductView(params.slug);

  const relatedProducts = await getRelatedProducts(product.category, product.slug);

  const formattedPrice = formatCurrency(product.price);

  let primaryImage = "";
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) primaryImage = parsed[0];
  } catch {}

  const settings = await prisma.siteSettings.findFirst();
  const waNumberRaw = settings?.waNumber || "6285811362629";
  let waNumberClean = waNumberRaw.replace(/\D/g, "");
  if (waNumberClean.startsWith("0")) {
    waNumberClean = "62" + waNumberClean.substring(1);
  }

  // ─── JSON-LD Structured Data (SEO) ────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: primaryImage,
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Hobbits Wood",
    },
    offers: {
      "@type": "Offer",
      url: `https://hobbitswood.vercel.app/product/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Hobbits Wood Boyolali",
      },
    },
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-brand-cream dark:bg-[#1A1A1A] pb-12 pt-28 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-6 lg:mb-8 flex items-center gap-2 text-xs text-brand-dark font-medium dark:text-brand-light"
            aria-label="Breadcrumb"
            id="product-breadcrumb"
          >
            <Link
              href="/"
              className="transition-colors hover:text-brand-dark dark:hover:text-brand-light"
            >
              Beranda
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="transition-colors hover:text-brand-dark dark:hover:text-brand-light"
            >
              Katalog
            </Link>
            <span>/</span>
            <span className="text-brand-dark dark:text-brand-light">{product.name}</span>
          </nav>

          <ProductClientView product={product} waNumber={waNumberClean} />
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="py-20 px-6 lg:px-12 bg-[#F7F5F2] dark:bg-[#222]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-brand-dark dark:text-brand-light mb-10 border-b border-brand-wood/20 dark:border-white/10 pb-4">
              Koleksi Serupa
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {relatedProducts.map((p: import('@prisma/client').Product) => (
                <div key={p.id}>
                  {/* @ts-ignore - ProductCard works with this prop */}
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
