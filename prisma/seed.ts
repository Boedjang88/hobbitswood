import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.marketplaceLink.deleteMany();
  await prisma.product.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.faqCategory.deleteMany();

  // Dummy products according to user request: figura, display, lemari, rak
  const products = [
    // --- FIGURA (FRAMES) ---
    {
      slug: "figura-kayu-jati-minimalis",
      name: "Figura Kayu Jati Minimalis",
      price: 150000,
      category: "Figura",
      images: JSON.stringify([
        "/images/products/figura-jati.jpg",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Figura foto berbahan dasar kayu jati solid dengan finishing natural yang menonjolkan urat kayu. Cocok untuk memajang memori berharga, sertifikat, maupun karya seni Anda dengan nuansa klasik dan elegan.",
      dimensions: JSON.stringify(["Ukuran 4R", "Ukuran 5R [+15000]", "Ukuran 8R [+35000]", "Ukuran 10R [+50000]"]),
      materials: JSON.stringify(["Kayu Jati Solid", "Kaca Akrilik 2mm [+25000]", "Backing MDF"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/figura-jati" },
          { platform: "Shopee", url: "https://shopee.co.id/hobbitswood/figura-jati" }
        ]
      }
    },
    {
      slug: "figura-dinding-rustic",
      name: "Figura Dinding Kayu Rustic",
      price: 185000,
      category: "Figura",
      images: JSON.stringify([
        "/images/products/figura-rustic.jpg",
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544273677-c433136021d4?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Membawa kesan hangat dengan desain rustic yang dibiarkan alami tanpa cat berlebih. Sangat cocok untuk dekorasi dinding ruang tamu atau kamar tidur bernuansa vintage.",
      dimensions: JSON.stringify(["Ukuran A4", "Ukuran A3 [+45000]"]),
      materials: JSON.stringify(["Kayu Pinus Bekas (Recycled)", "Kaca Standar"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Shopee", url: "https://shopee.co.id/hobbitswood/figura-rustic" }
        ]
      }
    },

    // --- DISPLAY ---
    {
      slug: "etalase-display-kaca-premium",
      name: "Etalase Display Kaca Premium",
      price: 4500000,
      category: "Display",
      images: JSON.stringify([
        "/images/products/etalase-kaca.jpg",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Etalase kaca elegan dengan rangka kayu sungkai solid. Sangat cocok digunakan sebagai lemari pajangan koleksi kesayangan di ruang tamu, atau sebagai display produk premium di toko Anda. Dilengkapi dengan lampu sorot LED hangat.",
      dimensions: JSON.stringify(["P 80cm x L 40cm x T 180cm", "P 120cm x L 40cm x T 180cm [+1200000]"]),
      materials: JSON.stringify(["Kayu Sungkai", "Kaca Tempered 5mm [+350000]", "Lampu LED Warm White"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/etalase-kaca" }
        ]
      }
    },
    {
      slug: "rak-display-bazar-lipat",
      name: "Rak Display Bazar Kayu Lipat",
      price: 850000,
      category: "Display",
      images: JSON.stringify([
        "/images/products/display-bazar.jpg",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Rak display portabel yang sangat mudah dilipat dan dibawa untuk keperluan pameran atau bazar. Terbuat dari kayu ringan namun kokoh, memberikan kesan estetik dan natural pada produk jualan Anda.",
      dimensions: JSON.stringify(["Tinggi 120cm x Lebar 60cm"]),
      materials: JSON.stringify(["Kayu Jati Belanda", "Engsel Baja Ringan"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/display-bazar" }
        ]
      }
    },

    // --- RAK (SHELVES) ---
    {
      slug: "rak-buku-susun-estetik",
      name: "Rak Buku Susun Estetik",
      price: 2100000,
      category: "Rak",
      images: JSON.stringify([
        "/images/products/rak-buku.jpg",
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Rak buku susun bergaya industrial minimalis. Perpaduan sempurna antara kehangatan kayu jati alami dan rangka besi hitam yang kokoh. Mampu menahan beban buku berat hingga 30kg per tingkat rak.",
      dimensions: JSON.stringify(["Tingkat 3 (Tinggi 110cm)", "Tingkat 4 (Tinggi 145cm)", "Tingkat 5 (Tinggi 180cm)"]),
      materials: JSON.stringify(["Kayu Jati Grade B", "Rangka Besi Hollow Hitam Doff"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Shopee", url: "https://shopee.co.id/hobbitswood/rak-buku" }
        ]
      }
    },
    {
      slug: "rak-dinding-melayang-floating",
      name: "Rak Dinding Melayang (Floating)",
      price: 250000,
      category: "Rak",
      images: JSON.stringify([
        "/images/products/rak-dinding.jpg",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Rak dinding minimalis (floating shelf) tanpa siku penahan yang terlihat. Memberikan kesan bersih, luas, dan modern pada dinding rumah Anda. Pemasangan sangat mudah, lengkap dengan sekrup dan fischer tersembunyi.",
      dimensions: JSON.stringify(["Panjang 40cm", "Panjang 60cm", "Panjang 80cm", "Panjang 100cm"]),
      materials: JSON.stringify(["Kayu Pinus Solid", "Bracket Baja Tersembunyi"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/rak-dinding" },
          { platform: "Shopee", url: "https://shopee.co.id/hobbitswood/rak-dinding" }
        ]
      }
    },
    {
      slug: "rak-sepatu-kayu-tertutup",
      name: "Rak Sepatu Kayu Tertutup",
      price: 1450000,
      category: "Rak",
      images: JSON.stringify([
        "/images/products/rak-sepatu.jpg",
        "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Menyimpan koleksi sepatu dengan rapi dan bebas debu. Dilengkapi ventilasi udara kecil di bagian belakang untuk mencegah bau dan kelembapan. Desain mungil yang cocok ditempatkan di dekat pintu masuk.",
      dimensions: JSON.stringify(["P 80cm x L 35cm x T 100cm (Kapasitas 12 Pasang)"]),
      materials: JSON.stringify(["Kayu Mahoni", "Finishing Melamine Doff"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/rak-sepatu" }
        ]
      }
    },

    // --- LEMARI (CUPBOARDS) ---
    {
      slug: "lemari-pakaian-3-pintu-retro",
      name: "Lemari Pakaian 3 Pintu Retro",
      price: 8900000,
      category: "Lemari",
      images: JSON.stringify([
        "/images/products/lemari-3-pintu.jpg",
        "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Lemari pakaian desain retro dengan ruang penyimpanan luas. Dibuat menggunakan kayu mahoni pilihan yang telah melalui proses oven (kiln-dry) sehingga anti rayap dan tidak mudah memuai. Dilengkapi laci rahasia di bagian dalam.",
      dimensions: JSON.stringify(["P 160cm x L 60cm x T 200cm"]),
      materials: JSON.stringify(["Kayu Mahoni Solid", "Handle Kuningan Asli", "Engsel Soft-Close"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/lemari-3-pintu" },
          { platform: "WhatsApp", url: "https://wa.me/6285811362629" }
        ]
      }
    },
    {
      slug: "kabinet-dapur-kayu-minimalis",
      name: "Kabinet Dapur Kayu Minimalis",
      price: 6200000,
      category: "Lemari",
      images: JSON.stringify([
        "/images/products/kabinet-dapur.jpg",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556909206-d5306cf536d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Mempercantik area dapur dengan kabinet berbahan kayu solid yang dirancang khusus tahan terhadap cipratan air dan minyak ringan. Terdapat banyak kompartemen untuk menyimpan alat masak dan piring.",
      dimensions: JSON.stringify(["P 120cm x L 50cm x T 85cm (Base Cabinet)"]),
      materials: JSON.stringify(["Kayu Sungkai", "Finishing PU Anti Air"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Shopee", url: "https://shopee.co.id/hobbitswood/kabinet-dapur" }
        ]
      }
    },
    {
      slug: "lemari-laci-drawer-vintage",
      name: "Lemari Laci (Drawer) Vintage",
      price: 3400000,
      category: "Lemari",
      images: JSON.stringify([
        "/images/products/drawer-vintage.jpg",
        "https://images.unsplash.com/photo-1532372320978-9b4d6a3a854c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
      ]),
      description: "Lemari berlaci lima susun dengan ukiran vintage pada sudutnya. Sangat praktis untuk mengorganisir pakaian lipat, dokumen, atau aksesoris. Menggunakan rel laci berkualitas yang meluncur mulus.",
      dimensions: JSON.stringify(["P 60cm x L 45cm x T 110cm"]),
      materials: JSON.stringify(["Kayu Jati Grade C", "Rel Laci Double Track"]),
      status: "PUBLISHED",
      links: {
        create: [
          { platform: "Tokopedia", url: "https://tokopedia.com/hobbitswood/drawer-vintage" }
        ]
      }
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log(`Seeding finished. Added ${products.length} products.`);

  // Seed FAQ categories & items
  const faqCategoriesData = [
    {
      title: "Pemesanan & Custom Order",
      order: 1,
      items: {
        create: [
          {
            question: "Bagaimana cara memesan produk di Hobbits Wood?",
            answer: "Anda dapat memesan produk ready stock langsung melalui katalog di website kami yang terhubung dengan official store Tokopedia dan Shopee. Untuk pemesanan custom (ukuran, model, bahan khusus), Anda dapat menghubungi tim konsultasi desain kami melalui tombol 'Custom Order' yang mengarah langsung ke WhatsApp kami.",
            order: 1
          },
          {
            question: "Apakah saya bisa memesan furnitur dengan desain saya sendiri (Custom Order)?",
            answer: "Tentu saja! Sebagai studio seni kayu handcrafted, spesialisasi kami adalah mewujudkan ide interior Anda. Cukup kirimkan sketsa kasar, referensi foto, atau blueprint desain beserta detail ukuran yang Anda ingin konsultasikan ke WhatsApp kami. Desainer kami akan membantu membuat visualisasi dan menghitung estimasi biayanya.",
            order: 2
          },
          {
            question: "Berapa lama waktu pengerjaan untuk pesanan custom?",
            answer: "Waktu pengerjaan produk custom bervariasi bergantung pada dimensi, tingkat kesulitan ukiran, dan ketersediaan bahan baku. Rata-rata produk kecil seperti figura custom memakan waktu 3–5 hari kerja. Sedangkan produk besar seperti kabinet dapur kustom, lemari pakaian retro, atau set meja makan solid memakan waktu 2–4 minggu. Estimasi waktu pasti akan kami sampaikan saat penawaran harga disetujui.",
            order: 3
          },
          {
            question: "Apakah ada batas minimal pemesanan (Minimum Order Quantity)?",
            answer: "Tidak ada minimal pemesanan untuk sebagian besar produk kami. Kami melayani pembuatan satuan dengan dedikasi penuh yang sama seperti pesanan dalam volume besar. Namun untuk pesanan kebutuhan hotel, cafe, kantor, atau gift korporat dalam jumlah banyak, kami menawarkan potongan harga khusus.",
            order: 4
          }
        ]
      }
    },
    {
      title: "Bahan Baku & Kualitas",
      order: 2,
      items: {
        create: [
          {
            question: "Jenis kayu apa saja yang digunakan oleh Hobbits Wood?",
            answer: "Kami berkomitmen menggunakan kayu solid legal berkualitas tinggi bersertifikat SVLK. Pilihan utama kami adalah kayu Jati Solid (Teak Wood Grade A/B) yang sangat kuat dan awet, kayu Sungkai dengan urat seratnya yang terang dan estetik untuk nuansa minimalis Japandi, serta kayu Mahoni berkualitas tinggi yang telah di-oven (kiln-dry) agar tahan rayap dan stabil dari penyusutan.",
            order: 1
          },
          {
            question: "Apakah kayu yang digunakan tahan rayap dan anti jamur?",
            answer: "Ya. Seluruh kayu solid kami melalui proses pengeringan oven (kiln-dry) dengan kadar air (MC) standar di bawah 12% untuk memastikan kestabilan struktur dan mematikan serangga di dalam kayu. Selain itu, kami menerapkan bahan anti-rayap khusus sebelum proses finishing serta pelindung anti-jamur untuk memastikan furnitur Anda bertahan lintas generasi.",
            order: 2
          },
          {
            question: "Jenis finishing apa saja yang digunakan pada produk Hobbits Wood?",
            answer: "Kami menawarkan beberapa tipe finishing sesuai kebutuhan estetika Anda: 1. Natural Oil/Wax (Eco-Friendly) menonjolkan serat asli kayu dan aman untuk makanan (food-safe). 2. Water-Based Lacquer ramah lingkungan, tahan cipratan air, tidak berbau menyengat, sangat cocok untuk area indoor. 3. PU (Polyurethane) Coating untuk perlindungan ekstra tebal dari ketahanan gores, panas, dan air, direkomendasikan untuk top table meja makan dan base cabinet dapur.",
            order: 3
          }
        ]
      }
    },
    {
      title: "Pengiriman & Pemasangan",
      order: 3,
      items: {
        create: [
          {
            question: "Bagaimana pengiriman produk besar seperti lemari atau meja makan?",
            answer: "Untuk wilayah Jabodetabek, Boyolali, Solo, dan sekitarnya, produk besar akan dikirim langsung menggunakan armada truk/mobil pickup Hobbits Wood. Pengiriman ini sudah include jasa pemasangan langsung di rumah Anda. Untuk wilayah lain di Pulau Jawa & Bali, kami bekerja sama dengan ekspedisi kargo khusus furnitur langganan kami yang tepercaya dan aman.",
            order: 1
          },
          {
            question: "Apakah produk dikirim dalam kondisi utuh atau perlu dirakit?",
            answer: "Demi kekuatan struktur maksimal, sebagian besar furnitur kami (seperti lemari laci, kabinet dapur, kursi jati) dikirim dalam kondisi utuh terpasang (fully-assembled). Namun, untuk produk dengan dimensi sangat besar atau berisiko patah saat pengapalan (seperti rak susun tinggi atau meja makan besar), kami mendesain sambungan semi-knockdown presisi tinggi yang mudah dirakit, lengkap dengan panduan dan perkakas instalasinya.",
            order: 2
          },
          {
            question: "Berapa ongkos kirim ke luar kota?",
            answer: "Kami menawarkan program Gratis Ongkir untuk wilayah Bekasi, Jakarta, Solo, dan Boyolali untuk produk-produk tertentu dengan syarat dan ketentuan berlaku. Untuk luar kota/luar pulau, tarif dihitung berdasarkan kubikasi volume barang dan kota tujuan melalui ekspedisi kargo furnitur rekanan agar biayanya jauh lebih murah dibanding kurir reguler. Silakan hubungi admin kami untuk mendapatkan estimasi ongkir ke kota Anda.",
            order: 3
          }
        ]
      }
    },
    {
      title: "Perawatan & Garansi",
      order: 4,
      items: {
        create: [
          {
            question: "Bagaimana cara merawat furnitur kayu agar tahan lama?",
            answer: "Perawatannya sangat mudah: 1. Bersihkan debu secara rutin menggunakan kain mikrofiber kering atau sedikit lembap. 2. Hindari meletakkan furnitur kayu solid di bawah paparan sinar matahari langsung atau area yang sangat lembap untuk mencegah perubahan warna atau retak kayu alami. 3. Gunakan alas tatakan gelas/piring panas pada permukaan meja makan. 4. Untuk menjaga kilau alaminya, Anda dapat mengoleskan beeswax atau furniture polish khusus kayu setahun sekali.",
            order: 1
          },
          {
            question: "Apakah Hobbits Wood memberikan garansi produk?",
            answer: "Tentu saja. Kami percaya pada kualitas pengerjaan kami. Setiap furnitur besar kami dilindungi oleh Garansi Struktur selama 12 Bulan sejak barang diterima. Garansi mencakup kerusakan konstruksi (sambungan lepas, retak kayu struktural, engsel rusak, atau kayu memuai tidak wajar). Garansi tidak berlaku untuk kerusakan akibat penggunaan yang salah, benturan keras, bencana alam, atau kelembapan ruangan ekstrem di luar wajar.",
            order: 2
          }
        ]
      }
    }
  ];

  console.log("Seeding FAQ categories & items...");
  for (const cat of faqCategoriesData) {
    await prisma.faqCategory.create({
      data: cat,
    });
  }

  console.log("Seeding FAQ finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
