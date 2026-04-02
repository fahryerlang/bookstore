import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Truck,
  Shield,
  Star,
  ArrowUpRight,
  ArrowRight,
  Quote,
  Sparkles,
  Award,
  Clock,
} from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  const books = await prisma.book.findMany({
    where: {
      ...(q && { title: { contains: q } }),
      ...(category && { categoryId: category }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const totalBooks = await prisma.book.count();
  const totalCategories = await prisma.category.count();

  return (
    <div className="flex-1">
      {/* ==================== HERO (White bg — reference style) ==================== */}
      <section className="relative bg-white min-h-screen flex items-center overflow-hidden">
        {/* Subtle decorations */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-50/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-50/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text */}
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Toko Buku Online Terpercaya
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                Temukan{" "}
                <span className="text-primary relative inline-block">
                  Buku
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="#0992C2"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>
                <br />
                Favoritmu
              </h1>

              {/* Quote */}
              <div className="mt-8 flex gap-3 items-start">
                <Quote className="h-8 w-8 text-primary/20 flex-shrink-0 rotate-180" />
                <p className="text-gray-500 text-base leading-relaxed max-w-md italic">
                  Jelajahi koleksi buku terlengkap dari berbagai kategori. Dari
                  fiksi hingga sains, semuanya ada di BookStore.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalBooks}+
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">Judul Buku</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalCategories}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">Kategori</p>
                </div>
              </div>

              {/* CTA (outlined + solid dark — reference style) */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gray-900 hover:text-white transition-all group"
                >
                  Jelajahi Katalog
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-all"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>

            {/* Right — Book visual with accent circle */}
            <div className="hidden lg:flex justify-center relative animate-fade-in-right">
              <div className="relative">
                {/* Large accent circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-primary rounded-full" />

                {/* Book cover */}
                <div className="relative z-10 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl mx-auto mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
                    alt="Buku populer"
                    fill
                    sizes="256px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute top-4 left-8 z-20 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float">
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Bestseller!
                  </span>
                </div>

                {/* Rating card */}
                <div className="absolute bottom-6 -left-4 z-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float animation-delay-400">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">4.9/5</p>
                    <p className="text-xs text-gray-500">Rating Pembeli</p>
                  </div>
                </div>

                {/* Shipping card */}
                <div className="absolute bottom-16 -right-6 z-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float animation-delay-200">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Gratis Ongkir
                    </p>
                    <p className="text-xs text-gray-500">Se-Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES (Dark bg — reference "My Services") ==================== */}
      <section className="bg-[#1a1a2e] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Kategori <span className="text-primary">Buku</span>
            </h2>
            <p className="mt-3 text-gray-400 max-w-lg">
              Jelajahi buku dari berbagai genre dan topik. Setiap kategori
              dikurasi dengan koleksi terbaik untuk kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Fiksi & Novel",
                desc: "Petualangan, romansa, dan kisah menegangkan yang akan membawamu ke dunia lain.",
                image:
                  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
              },
              {
                title: "Sains & Teknologi",
                desc: "Pelajari penemuan terbaru dan teknologi masa depan dari para ahli dunia.",
                image:
                  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
              },
              {
                title: "Pengembangan Diri",
                desc: "Tingkatkan kualitas hidupmu dengan buku-buku motivasi dan produktivitas.",
                image:
                  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {cat.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <Link
                    href="#katalog"
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US (reference "Why Hire Me") ==================== */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Kenapa Memilih{" "}
                <span className="text-primary">BookStore?</span>
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed">
                Kami berkomitmen memberikan pengalaman belanja buku online
                terbaik. Setiap buku yang kami jual dijamin asli dan
                berkualitas tinggi.
              </p>

              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {totalBooks}+
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Judul Tersedia</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {totalCategories}+
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Kategori Buku</p>
                </div>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-full hover:bg-primary-dark transition-all mt-8 group"
              >
                Daftar Sekarang
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl rotate-3" />
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                    alt="Koleksi buku kami"
                    width={600}
                    height={600}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      100% Original
                    </p>
                    <p className="text-xs text-gray-500">Buku Asli</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards row */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Pengiriman Cepat",
                desc: "Ke seluruh Indonesia",
              },
              {
                icon: Shield,
                title: "Transaksi Aman",
                desc: "Pembayaran terproteksi",
              },
              {
                icon: Award,
                title: "Buku Original",
                desc: "Dijamin 100% asli",
              },
              {
                icon: Clock,
                title: "Support 24/7",
                desc: "Layanan pelanggan terbaik",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="p-3 bg-primary-50 rounded-xl flex-shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATALOG ==================== */}
      <section id="katalog" className="bg-gray-50 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Koleksi <span className="text-primary">Buku Kami</span>
              </h2>
              <p className="mt-2 text-gray-500">
                {q
                  ? `Hasil pencarian untuk "${q}"`
                  : "Temukan buku yang kamu cari dari berbagai kategori pilihan"}
              </p>
            </div>
            <Link
              href="#katalog"
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="max-w-xl mb-8">
            <SearchBar />
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/"
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !category
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Book Grid */}
          {books.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Buku tidak ditemukan
              </h3>
              <p className="text-gray-500 mt-1">
                Coba gunakan kata kunci pencarian lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  price={book.price}
                  imageUrl={book.imageUrl}
                  category={book.category.name}
                  stock={book.stock}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Testimonial dari{" "}
                <span className="text-primary">Pembeli Kami</span>
              </h2>
              <p className="mt-4 text-gray-500 max-w-md">
                Ribuan pelanggan sudah mempercayakan kebutuhan buku mereka
                kepada BookStore.
              </p>
            </div>
            <div className="space-y-5">
              {[
                {
                  name: "Andi Pratama",
                  role: "Mahasiswa",
                  text: "Koleksi bukunya lengkap banget! Pengiriman juga cepat, buku sampai dalam kondisi sempurna.",
                  rating: 5,
                },
                {
                  name: "Siti Rahayu",
                  role: "Guru",
                  text: "Harga sangat terjangkau dibanding toko lain. Sudah jadi langganan beli buku di sini.",
                  rating: 5,
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{t.text}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA (Dark card — reference "Let's Discuss") ==================== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#1a1a2e] rounded-3xl px-8 sm:px-16 py-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Punya Buku Impian?{" "}
                <span className="text-primary">Temukan di Sini</span>
              </h2>
              <p className="mt-4 text-gray-400">
                Daftar sekarang dan nikmati pengalaman belanja buku online
                terbaik dengan harga spesial dan pengiriman cepat.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-dark transition-all group"
                >
                  Daftar Gratis
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>

            {/* Category pills (reference tag style) */}
            <div className="relative mt-12 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-4 py-2 rounded-full border border-white/10 text-white/60 text-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </div>
  );
}
