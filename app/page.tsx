import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  BookOpen,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Award,
  Clock,
  ChevronDown,
} from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  const [books, categories, totalBooks, totalCategories, user] =
    await Promise.all([
      prisma.book.findMany({
        where: {
          ...(q && { title: { contains: q } }),
          ...(category && { categoryId: category }),
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.book.count(),
      prisma.category.count(),
      getSession(),
    ]);

  const featuredBooks = books.slice(0, 3);

  return (
    <>
      <Navbar user={user} />
      <div className="flex-1">
        {/* ==================== HERO — Full-screen dark overlay like reference ==================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=1080&fit=crop"
            alt="Perpustakaan"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-dark/70" />
        </div>

        {/* Side vertical text — like reference */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 z-10">
          <div className="w-px h-16 bg-white/30" />
          <span className="text-white/50 text-xs uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            Toko Buku Online
          </span>
          <div className="w-px h-16 bg-white/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in-up">
          {/* Stars row */}
          <div className="flex justify-center gap-1.5 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-primary fill-primary" />
            ))}
          </div>

          {/* Subtitle */}
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-6">
            Toko Buku Online Terpercaya
          </p>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            TEMUKAN BUKU
            <br />
            <span className="text-primary">FAVORITMU</span>
          </h1>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="#katalog"
              className="inline-flex items-center gap-3 border-2 border-primary text-primary uppercase tracking-[0.2em] text-sm font-semibold px-10 py-4 hover:bg-primary hover:text-dark transition-all duration-300"
            >
              Jelajahi Katalog
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-float">
            <ChevronDown className="h-5 w-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* Stats bar — positioned between hero and featured section */}
      <div className="relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-light/95 backdrop-blur-md border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 shadow-2xl shadow-black/20">
            <div className="px-6 py-5 text-center">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-1">
                Koleksi Buku
              </p>
              <p className="text-white text-xl font-bold">{totalBooks}+</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-1">
                Kategori
              </p>
              <p className="text-white text-xl font-bold">
                {totalCategories}
              </p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-primary text-xs uppercase tracking-[0.2em] mb-1">
                Rating
              </p>
              <p className="text-white text-xl font-bold">4.9/5</p>
            </div>
            <Link
              href="#katalog"
              className="px-6 py-5 bg-primary text-dark font-bold uppercase tracking-[0.15em] text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 rounded-r-2xl sm:rounded-r-2xl rounded-b-2xl sm:rounded-bl-none lg:rounded-bl-none"
            >
              Lihat Katalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== FEATURED BOOKS — Like "Rooms & Suites" section ==================== */}
      <section className="bg-white pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header with ornamental style */}
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Koleksi Pilihan
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight">
              Buku <span className="text-primary">Terpopuler</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
              Jelajahi buku-buku pilihan kami yang paling diminati oleh para
              pembaca dari berbagai genre dan topik menarik.
            </p>
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/40" />
              <div className="w-12 h-px bg-primary/40" />
            </div>
          </div>

          {/* Featured books grid — 3 columns like rooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group"
              >
                <div className="overflow-hidden">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="pt-5">
                    <p className="text-primary text-xs uppercase tracking-[0.2em] font-medium">
                      {book.category.name}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-dark group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-gray-500 text-sm">
                        Rp {book.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-primary fill-primary"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT — Split layout like reference ==================== */}
      <section className="bg-[#f5f0e8] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Image grid like reference */}
            <div className="relative animate-fade-in-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop"
                      alt="Koleksi buku"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop"
                      alt="Membaca buku"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop"
                      alt="Rak buku"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop"
                      alt="Perpustakaan"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Text content */}
            <div className="animate-fade-in-right">
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
                Tentang BookStore
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
                TOKO BUKU ONLINE
                <br />
                <span className="text-primary">TERPERCAYA</span>
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                BookStore hadir sebagai solusi belanja buku online terlengkap di
                Indonesia. Kami menyediakan koleksi buku dari berbagai kategori
                mulai dari fiksi, non-fiksi, teknologi, sejarah, hingga sains.
                Setiap buku yang kami jual dijamin 100% original dan
                berkualitas tinggi.
              </p>

              {/* Stats row — like reference */}
              <div className="mt-10 flex gap-12">
                <div>
                  <p className="text-5xl font-bold text-dark">{totalBooks}+</p>
                  <div className="w-8 h-0.5 bg-primary mt-3 mb-2" />
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Judul Buku
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-dark">4.9</p>
                  <div className="w-8 h-0.5 bg-primary mt-3 mb-2" />
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Rating Pembeli
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 mt-10 bg-primary text-dark uppercase tracking-[0.15em] text-sm font-bold px-8 py-4 hover:bg-primary-dark transition-colors"
              >
                Selengkapnya
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES — Dark section ==================== */}
      <section className="bg-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Genre & Topik
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Kategori <span className="text-primary">Buku</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/40" />
              <div className="w-12 h-px bg-primary/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {[
              {
                title: "Fiksi & Novel",
                desc: "Petualangan, romansa, dan kisah menegangkan yang membawamu ke dunia lain.",
                image:
                  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
              },
              {
                title: "Sains & Teknologi",
                desc: "Penemuan terbaru dan teknologi masa depan dari para ahli dunia.",
                image:
                  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
              },
              {
                title: "Pengembangan Diri",
                desc: "Tingkatkan kualitas hidup dengan buku motivasi dan produktivitas.",
                image:
                  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className="group bg-dark relative overflow-hidden"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-primary text-xs uppercase tracking-[0.2em] font-medium mb-2">
                    Kategori
                  </p>
                  <h3 className="font-bold text-white text-xl mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                  <Link
                    href="#katalog"
                    className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-medium uppercase tracking-wider hover:text-primary-light transition-colors"
                  >
                    Lihat Buku
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES — Elegant cards ==================== */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Keunggulan Kami
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight">
              Kenapa Memilih <span className="text-primary">BookStore?</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/40" />
              <div className="w-12 h-px bg-primary/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Pengiriman Cepat",
                desc: "Pengiriman ke seluruh Indonesia dengan estimasi 2-5 hari kerja.",
              },
              {
                icon: Shield,
                title: "Transaksi Aman",
                desc: "Pembayaran terproteksi dengan keamanan berlapis.",
              },
              {
                icon: Award,
                title: "Buku Original",
                desc: "Semua buku yang kami jual dijamin 100% asli.",
              },
              {
                icon: Clock,
                title: "Support 24/7",
                desc: "Layanan pelanggan siap membantu kapan saja.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group text-center p-8 border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <f.icon className="h-7 w-7 text-primary group-hover:text-dark transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATALOG ==================== */}
      <section id="katalog" className="bg-[#f5f0e8] py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Katalog Lengkap
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark tracking-tight">
              Koleksi <span className="text-primary">Buku Kami</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              {q
                ? `Hasil pencarian untuk "${q}"`
                : "Temukan buku yang kamu cari dari berbagai kategori pilihan"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/40" />
              <div className="w-12 h-px bg-primary/40" />
            </div>
          </div>

          {/* Search & Filter */}
          <div className="max-w-xl mx-auto mb-8">
            <SearchBar />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link
              href="/"
              className={`px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all border ${
                !category
                  ? "bg-dark text-white border-dark"
                  : "bg-transparent text-dark border-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all border ${
                  category === cat.id
                    ? "bg-dark text-white border-dark"
                    : "bg-transparent text-dark border-gray-300 hover:border-primary hover:text-primary"
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
              <h3 className="text-lg font-semibold text-dark">
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

      {/* ==================== TESTIMONIALS — Elegant dark section ==================== */}
      <section className="bg-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Testimonial
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Kata <span className="text-primary">Pembeli Kami</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/40" />
              <div className="w-12 h-px bg-primary/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Andi Pratama",
                role: "Mahasiswa",
                text: "Koleksi bukunya lengkap banget! Pengiriman juga cepat, buku sampai dalam kondisi sempurna. Sangat recommended.",
                rating: 5,
              },
              {
                name: "Siti Rahayu",
                role: "Guru",
                text: "Harga sangat terjangkau dibanding toko lain. Sudah jadi langganan beli buku di sini. Pelayanan sangat memuaskan.",
                rating: 5,
              },
              {
                name: "Budi Santoso",
                role: "Dosen",
                text: "Kualitas buku terjamin original. Proses pembelian mudah dan cepat. Toko buku online terbaik yang pernah saya gunakan.",
                rating: 5,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="border border-white/10 p-8 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-gray-400 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/10">
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA — Luxury banner ==================== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=600&fit=crop"
            alt="Perpustakaan"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Mulai Sekarang
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            TEMUKAN BUKU
            <br />
            <span className="text-primary">IMPIANMU</span>
          </h2>
          <p className="mt-6 text-gray-400 max-w-lg mx-auto leading-relaxed">
            Daftar sekarang dan nikmati pengalaman belanja buku online terbaik
            dengan harga spesial dan pengiriman cepat ke seluruh Indonesia.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 bg-primary text-dark uppercase tracking-[0.15em] text-sm font-bold px-10 py-4 hover:bg-primary-dark transition-colors"
            >
              Daftar Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#katalog"
              className="inline-flex items-center justify-center gap-3 border-2 border-white/30 text-white uppercase tracking-[0.15em] text-sm font-semibold px-10 py-4 hover:border-primary hover:text-primary transition-all"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
        <Footer />
      </div>
    </>
  );
}
