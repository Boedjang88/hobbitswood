export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  model3d?: string;
  description: string;
  dimensions: string;
  material: string;
  marketplace_url: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "lemari-laci-drawer-vintage",
    name: "Lemari Laci Drawer Vintage",
    price: 3400000,
    category: "Lemari",
    image: "/images/products/drawer-vintage.jpg",
    description:
      "Lemari berlaci lima susun dengan ukiran vintage pada sudutnya. Sangat praktis untuk mengorganisir pakaian lipat, dokumen, atau aksesoris. Menggunakan rel laci berkualitas yang meluncur mulus.",
    dimensions: "P 60cm x L 45cm x T 110cm",
    material: "Kayu Jati Grade C — Rel Laci Double Track",
    marketplace_url: "https://www.tokopedia.com/woodcraft-bekasi/drawer-vintage",
  },
  {
    id: "2",
    slug: "meja-tamu-sungkai",
    name: "Meja Tamu Sungkai",
    price: 4200000,
    category: "Meja",
    image: "/images/meja-sungkai.jpg",
    description:
      "Meja tamu elegan dari kayu sungkai dengan permukaan lebar yang sempurna untuk ruang keluarga. Desain minimalis Skandinavia dipadu sentuhan tropis Indonesia menciptakan karakter yang unik. Kaki meruncing dengan sudut 8° memberikan kesan ringan namun tetap kokoh.",
    dimensions: "Tinggi 45cm × Panjang 120cm × Lebar 60cm",
    material: "Kayu Sungkai Solid — Finishing Water-Based Lacquer",
    marketplace_url: "https://www.tokopedia.com/woodcraft-bekasi/meja-tamu-sungkai",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
