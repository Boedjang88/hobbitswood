import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Eye, AlertTriangle, TrendingUp, Pencil, CircleDollarSign, Settings, Smartphone, MessageSquare } from "lucide-react";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import { MotionContainer, MotionItem } from "@/components/admin/DashboardAnimations";
import QuickEditButton from "@/components/admin/QuickEditButton";

const getPrimaryImage = (imagesStr: string) => {
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) && parsed.length > 0 && parsed[0] ? parsed[0] : "/images/hero.jpg";
  } catch {
    return "/images/hero.jpg";
  }
};

export default async function AdminDashboard() {
  // Optimized parallel fetching with specific projections to maximize database performance
  const [
    totalPublished,
    totalDrafts,
    totalTotal,
    viewsAggregate,
    valueAggregate,
    lowStockProducts,
    recentProducts,
    topProducts,
    settings,
    totalFaqQuestions
  ] = await Promise.all([
    prisma.product.count({ where: { isDeleted: false, status: "PUBLISHED" } }),
    prisma.product.count({ where: { isDeleted: false, status: "DRAFT" } }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.product.aggregate({
      where: { isDeleted: false },
      _sum: { views: true }
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      select: { price: true, stock: true }
    }),
    prisma.product.findMany({
      where: { isDeleted: false, stock: { lt: 5 } },
      orderBy: { stock: "asc" },
      select: { id: true, name: true, category: true, images: true, price: true, stock: true }
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, price: true, stock: true, images: true }
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { views: "desc" },
      take: 7,
      select: { name: true, views: true }
    }),
    prisma.siteSettings.findFirst(),
    prisma.faqItem.count()
  ]);

  const totalViews = viewsAggregate._sum.views || 0;
  const estimatedValue = valueAggregate.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

  // Fallback settings if not set in db
  const siteSettings = settings || {
    promoText: "Free Shipping across Java & Bali",
    waNumber: "628123456789",
    email: "muhammadluayyi89@gmail.com",
    workshop: "Boyolali, Jawa Tengah",
    jamBuka: "Senin - Sabtu, 08:00 - 17:00 WIB"
  };

  const chartData = topProducts.map((p) => ({
    name: p.name,
    views: p.views,
  }));

  // Dummy activity log to show storefront updates for integration preview
  const activities = [
    { type: "info", desc: "Seed FAQ diisi dengan 12 FAQ baru", time: "1 jam yang lalu" },
    { type: "success", desc: "Catalog sync dengan Supabase berhasil", time: "Baru saja" },
    { type: "views", desc: `Total ${totalViews} penayangan terekam pada katalog`, time: "Realtime" }
  ];

  return (
    <MotionContainer className="space-y-8 pb-12">
      {/* Header */}
      <MotionItem>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-zinc-100 font-serif">Dashboard Overview</h1>
            <p className="text-brand-dark dark:text-brand-light text-sm mt-1">Kelola inventory, FAQ, dan pengaturan tampilan toko Anda.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/admin/new"
              className="flex shrink-0 items-center justify-center gap-2 px-6 py-3 sm:py-2 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-white transition-all hover:shadow-md w-full sm:w-auto font-sans"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </header>
      </MotionItem>

      {/* Analytics Cards */}
      <MotionItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Products */}
        <Link href="/admin/products" className="block bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 hover:border-[#111] dark:hover:border-zinc-700 relative overflow-hidden group transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity">
            <Package className="w-16 h-16 dark:text-zinc-100" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-brand-dark dark:text-brand-light">Active Products</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-brand-dark dark:text-zinc-100">{totalPublished}</p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {totalDrafts} draft / {totalTotal} total
            </span>
          </div>
        </Link>

        {/* Estimated Inventory Value */}
        <div className="block bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity">
            <CircleDollarSign className="w-16 h-16 dark:text-zinc-100" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-brand-dark dark:text-brand-light">Inventory Value</h3>
          </div>
          <p className="text-2xl font-bold text-brand-dark dark:text-zinc-100">
            <span className="text-lg">Rp</span> {estimatedValue.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Total Views */}
        <div className="block bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity">
            <Eye className="w-16 h-16 dark:text-zinc-100" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-brand-dark dark:text-brand-light">Storefront Views</h3>
          </div>
          <p className="text-3xl font-bold text-brand-dark dark:text-zinc-100">{totalViews}</p>
        </div>

        {/* Low Stock Alerts */}
        <Link href="/admin/products" className="block bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 hover:border-[#111] dark:hover:border-zinc-700 relative overflow-hidden group transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity text-red-600 dark:text-red-500">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-brand-dark dark:text-brand-light">Low Stock Alerts</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${lowStockProducts.length > 0 ? "text-red-600 dark:text-red-400" : "text-brand-dark dark:text-zinc-100"}`}>
              {lowStockProducts.length}
            </p>
            <span className="text-xs font-semibold text-brand-dark dark:text-brand-light">items &lt; 5 stock</span>
          </div>
        </Link>
      </MotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <MotionItem className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 font-serif">Performance Overview</h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-brand-dark dark:text-brand-light">
                <div className="w-3 h-3 rounded-full bg-[#111] dark:bg-zinc-100" /> Views
              </span>
            </div>
          </div>
          <AnalyticsChart data={chartData} />
        </MotionItem>

        {/* User-facing integration preview card */}
        <MotionItem className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 font-serif flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                Storefront Preview
              </h2>
              <p className="text-xs text-brand-dark/60 dark:text-zinc-400">Tampilan aktif yang dilihat oleh customer</p>
            </div>
            <Link href="/admin/settings" className="p-2 text-brand-dark dark:text-zinc-400 hover:text-brand-dark dark:hover:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-xl transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 flex-1 space-y-5">
            {/* Promo Marquee */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500">Banner Pengumuman (Top Bar)</span>
              <div className="mt-1 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 text-xs font-semibold text-brand-dark dark:text-zinc-200">
                "{siteSettings.promoText}"
              </div>
            </div>

            {/* WA Checkout */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500">Checkout WhatsApp</span>
              <div className="mt-1 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 text-xs text-brand-dark dark:text-zinc-200">
                <span className="font-bold">+{siteSettings.waNumber}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold">AKTIF</span>
              </div>
            </div>

            {/* Jam Operasional */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500">Jam Buka Toko (Footer)</span>
              <div className="mt-1 text-xs font-semibold text-brand-dark dark:text-zinc-300">
                {siteSettings.jamBuka}
              </div>
            </div>

            {/* Quick Links Test */}
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark/50 dark:text-zinc-500">Link Cepat Pengunjung</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/" target="_blank" className="px-3 py-1.5 bg-[#111] dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold hover:opacity-85">Beranda</Link>
                <Link href="/shop" target="_blank" className="px-3 py-1.5 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs font-bold text-brand-dark dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-850">Katalog Shop</Link>
                <Link href="/faq" target="_blank" className="px-3 py-1.5 border border-[#EAEAEA] dark:border-zinc-800 rounded-lg text-xs font-bold text-brand-dark dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-850">Bantuan/FAQ ({totalFaqQuestions})</Link>
              </div>
            </div>
          </div>
        </MotionItem>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <MotionItem className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 flex flex-col transition-colors duration-300">
          <div className="p-6 border-b border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-950/50 rounded-t-2xl">
            <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 font-serif">Recent Additions</h2>
            <p className="text-xs text-brand-dark dark:text-brand-light mt-1">Produk baru saja ditambahkan</p>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4">
            {recentProducts.length === 0 ? (
              <p className="text-sm text-center text-brand-dark/50 dark:text-brand-light/50 my-auto py-6">No products found</p>
            ) : (
              recentProducts.map((p: any) => (
                <div key={p.id} className="flex items-center gap-4 group">
                  <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700">
                    <Image src={getPrimaryImage(p.images)} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-brand-dark dark:text-zinc-100 truncate">{p.name}</h4>
                    <p className="text-xs text-brand-dark dark:text-brand-light mt-0.5">
                      Rp {p.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <QuickEditButton product={{ id: p.id, name: p.name, price: p.price, stock: p.stock }} />
                </div>
              ))
            )}
          </div>
        </MotionItem>

        {/* Live Logs / Activity */}
        <MotionItem className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-zinc-800 p-6 flex flex-col transition-colors duration-300">
          <h2 className="text-lg font-bold text-brand-dark dark:text-zinc-100 font-serif flex items-center gap-2 mb-4 pb-4 border-b border-[#EAEAEA] dark:border-zinc-800">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            Aktivitas Terkini
          </h2>
          <div className="flex-1 space-y-4">
            {activities.map((act, index) => (
              <div key={index} className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-brand-dark dark:text-zinc-100 leading-relaxed">{act.desc}</span>
                <span className="text-[10px] text-brand-dark/50 dark:text-zinc-500">{act.time}</span>
              </div>
            ))}
          </div>
        </MotionItem>
      </div>

      {/* Low Stock Warnings Table */}
      {lowStockProducts.length > 0 && (
        <MotionItem className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
            <div>
              <h2 className="text-lg font-bold text-red-700 dark:text-red-400 font-serif">Needs Attention (Low Stock)</h2>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">These products have less than 5 items in stock.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="bg-white dark:bg-zinc-900 text-xs text-brand-dark dark:text-brand-light border-b border-[#EAEAEA] dark:border-zinc-800 uppercase tracking-wider">
                  <th className="p-4 font-semibold pl-6">Product</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Remaining Stock</th>
                  <th className="p-4 font-semibold text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {lowStockProducts.map((product: any) => (
                  <tr key={product.id} className="border-b border-[#EAEAEA]/50 dark:border-zinc-800/50 last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="relative h-12 w-12 sm:h-10 sm:w-10 shrink-0 rounded-lg overflow-hidden border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-800">
                        <Image src={getPrimaryImage(product.images)} alt={product.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="max-w-[150px] sm:max-w-xs overflow-hidden">
                        <div className="font-semibold text-brand-dark dark:text-zinc-100 line-clamp-2 whitespace-normal leading-tight" title={product.name}>{product.name}</div>
                        <div className="text-xs text-brand-dark dark:text-brand-light truncate mt-0.5">{product.category}</div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-dark dark:text-brand-light">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/20 dark:ring-red-400/30">
                        {product.stock} left
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <QuickEditButton product={{ id: product.id, name: product.name, price: product.price, stock: product.stock }} />
                      <Link
                        href={`/admin/edit/${product.id}`}
                        className="inline-flex p-2 text-brand-dark dark:text-brand-light hover:text-brand-dark dark:hover:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-[#EAEAEA] dark:hover:border-zinc-700"
                        title="Edit Full Details"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionItem>
      )}
    </MotionContainer>
  );
}
