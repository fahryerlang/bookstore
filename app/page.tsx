import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import BookCoverImage from "@/components/BookCoverImage";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import {
  getCachedHomeCatalogData,
  HOME_BOOKS_PER_PAGE,
} from "@/lib/public-home";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Shield,
  Star,
  Truck,
  Users,
} from "@/components/icons";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

const partnerNames = [
  "Book Club Nusantara",
  "Baca Bareng ID",
  "Literasi Pintar",
  "Komunitas Penulis",
  "Ruang Inspirasi",
];

const marqueeTopics = [
  "Kurasi buku pilihan editor",
  "Checkout super cepat",
  "Komunitas pembaca aktif",
  "Pengiriman seluruh Indonesia",
  "Diskon mingguan spesial",
  "Review jujur dan relevan",
];

const audienceCards = [
  {
    name: "Aulia Ramadhan",
    role: "Book Curator",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop",
    text: "Menyusun daftar bacaan mingguan yang relevan dan mudah diikuti.",
  },
  {
    name: "Clarisa Putri",
    role: "Community Host",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=600&fit=crop",
    text: "Memandu sesi diskusi ringan agar pengalaman membaca jadi lebih seru.",
  },
  {
    name: "Satria Wicaksono",
    role: "Review Editor",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop",
    text: "Merangkum insight dari buku populer dengan bahasa yang praktis.",
  },
  {
    name: "Nadine Fajri",
    role: "Podcast Producer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop",
    text: "Mengubah rekomendasi bacaan jadi obrolan audio yang lebih hidup.",
  },
];

const testimonials = [
  {
    quote:
      "Kurasi bukunya rapi banget. Dalam 10 menit saya langsung nemu 3 judul yang pas.",
    name: "Rama Kusnadi",
    role: "Content Creator",
  },
  {
    quote:
      "Desain katalognya enak dilihat, loading cepat, dan checkout juga mulus.",
    name: "Dina Mulyani",
    role: "Product Designer",
  },
  {
    quote:
      "Saya suka karena bisa cari berdasarkan kategori tanpa ribet. Sangat membantu.",
    name: "Fikri Dwi",
    role: "Mahasiswa",
  },
];

const editorialBlocks = [
  {
    title: "Kurasi Tajam",
    text: "Tim kami memilih judul berdasarkan kualitas isi dan relevansi topik.",
  },
  {
    title: "Checkout Ringan",
    text: "Alur belanja dibuat sesingkat mungkin agar kamu cepat sampai ke pembayaran.",
  },
  {
    title: "Support Responsif",
    text: "Kami siap bantu ketika kamu butuh rekomendasi atau info tambahan buku.",
  },
  {
    title: "Pengiriman Cepat",
    text: "Proses pesanan dikirim cepat dengan update status yang jelas.",
  },
];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function buildHomeHref(q?: string, categoryId?: string, page?: number) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (categoryId) {
    params.set("category", categoryId);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const {
    books,
    categories,
    totalBooks,
    totalCategories,
    filteredBookCount,
    highlightBooks,
  } = await getCachedHomeCatalogData(q ?? null, category ?? null, currentPage);

  const totalPages = Math.ceil(filteredBookCount / HOME_BOOKS_PER_PAGE);
  const trendingBooks = highlightBooks;
  const spotlightBook = highlightBooks[0];

  function buildCatalogPageHref(nextPage: number) {
    return buildHomeHref(q, category, nextPage);
  }

  return (
    <>
      <Navbar user={null} />

      <div className="relative flex-1 overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_top,_#edf5ff_0%,_#f8fbff_32%,_#ffffff_68%)]">
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-drift-slow" />
        <div className="pointer-events-none absolute -right-24 top-[34rem] h-72 w-72 rounded-full bg-sky-300/20 blur-3xl animate-drift" />

        <main className="relative mx-auto w-full max-w-[min(110rem,calc(100vw-2rem))] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <section className="relative rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_38px_95px_-60px_rgba(15,23,42,0.75)]">
            <div className="relative isolate overflow-hidden rounded-[24px]">
              <Image
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1200&fit=crop"
                alt="Interior perpustakaan dengan rak buku tinggi"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/62 to-primary/30" />
              <div className="absolute -left-12 top-8 h-44 w-44 rounded-full bg-primary/25 blur-3xl animate-drift" />
              <div className="absolute -right-16 bottom-2 h-56 w-56 rounded-full bg-blue-300/25 blur-3xl animate-drift-slow" />

              <div className="relative grid min-h-[500px] gap-8 p-6 sm:p-10 lg:grid-cols-[1.03fr_0.97fr] lg:p-12">
                <div className="flex flex-col justify-between">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    Premium Reading Hub
                  </div>

                  <div className="max-w-3xl animate-fade-in-up">
                    <p className="mb-5 text-xs uppercase tracking-[0.34em] text-blue-100 sm:text-sm">
                      Curated For Focused Readers
                    </p>
                    <h1 className="text-[clamp(2.2rem,6vw,5.15rem)] font-black leading-[0.95] tracking-[-0.045em] text-white">
                      Bacaan Kelas Atas,
                      <span className="block text-blue-200">Insight Lebih Tajam.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
                      Jelajahi katalog buku yang disusun dengan ritme visual bersih,
                      rekomendasi berkualitas, dan pengalaman belanja yang gesit dari
                      halaman pertama hingga checkout.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="#katalog"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-primary-dark"
                      >
                        Jelajahi Katalog
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/about"
                        className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                      >
                        Tentang Kami
                      </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-3 text-white/95 sm:max-w-lg">
                      <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                        <p className="text-lg font-bold leading-none">{totalBooks}+</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/75">
                          Active Titles
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                        <p className="text-lg font-bold leading-none">4.9</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/75">
                          User Rating
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                        <p className="text-lg font-bold leading-none">{totalCategories}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/75">
                          Categories
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col justify-end gap-4 animate-fade-in-right">
                  <div className="rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                      Live Spotlight
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-tight text-white">
                      {spotlightBook?.title ?? "Buku unggulan minggu ini"}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                      {spotlightBook?.author ? `Oleh ${spotlightBook.author}` : "Kurasi editor"}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-blue-200">
                      {spotlightBook ? formatRupiah(spotlightBook.price) : "Rp 0"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-2xl font-black text-white">17.5M+</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                        Monthly reach
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-2xl font-black text-white">1.5K+</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                        Curators
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/30">
                  <Truck className="h-4 w-4 text-blue-100" />
                </div>
                <p className="text-sm font-semibold">Pengiriman Seluruh Indonesia</p>
                <p className="mt-1 text-xs text-slate-300">
                  Estimasi cepat dengan status pengiriman transparan.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/30">
                  <Shield className="h-4 w-4 text-blue-100" />
                </div>
                <p className="text-sm font-semibold">Transaksi Aman</p>
                <p className="mt-1 text-xs text-slate-300">
                  Pembayaran terenkripsi dan checkout dibuat ringkas.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/30">
                  <Clock className="h-4 w-4 text-blue-100" />
                </div>
                <p className="text-sm font-semibold">Kurasi Update Harian</p>
                <p className="mt-1 text-xs text-slate-300">
                  Rekomendasi baru setiap hari berdasarkan topik populer.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-primary-50 py-3">
            <div className="flex w-max items-center gap-3 whitespace-nowrap px-4 animate-marquee">
              {[...marqueeTopics, ...marqueeTopics].map((topic, index) => (
                <span
                  key={`${topic}-${index}`}
                  className="rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dipercaya Komunitas Literasi
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {partnerNames.map((partner) => (
                <div
                  key={partner}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-600"
                >
                  {partner}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Trending Shelves
                </p>
                <h2 className="mt-2 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  Rilisan yang Lagi Dicari
                </h2>
              </div>

              <Link
                href="#katalog"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition hover:text-primary-dark"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {trendingBooks.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
                <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Belum ada buku tersedia
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Tambahkan data buku terlebih dahulu untuk menampilkan konten.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {trendingBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.8)] transition hover:-translate-y-1 hover:shadow-[0_28px_56px_-38px_rgba(15,23,42,0.6)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                      <BookCoverImage
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                      {book.category.name}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                      {book.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {formatRupiah(book.price)}
                      </span>
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-900">
                        Stock {book.stock}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="mt-14 rounded-3xl border border-blue-100 bg-gradient-to-br from-primary-50 via-white to-white p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Epic Headlines
                </p>
                <h2 className="mt-3 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  Konten Berkualitas,
                  <br />
                  Selalu Fresh dan Relevan.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Kami menggabungkan kurasi editor, data tren pembaca, dan
                  pengalaman belanja yang sederhana. Hasilnya: kamu lebih cepat
                  menemukan buku yang benar-benar kamu butuhkan.
                </p>

                <div className="mt-8 flex flex-wrap gap-8">
                  <div>
                    <p className="text-4xl font-semibold text-slate-900">
                      {totalBooks}+
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      Judul Aktif
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-semibold text-slate-900">4.9</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      Rating Pengguna
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-semibold text-slate-900">
                      {totalCategories}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      Kategori Bacaan
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#katalog"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
                  >
                    Mulai Pilih Buku
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    Hubungi Tim
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {partnerNames.map((partner) => (
                    <span
                      key={partner}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={
                      spotlightBook?.imageUrl ??
                      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=900&fit=crop"
                    }
                    alt={spotlightBook?.title ?? "Rekomendasi buku unggulan"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-blue-100 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Spotlight
                    </p>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900">
                      {spotlightBook?.title ?? "Buku unggulan minggu ini"}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {spotlightBook ? formatRupiah(spotlightBook.price) : "Rp 0"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Total Komunitas
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                      17.5M+
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Pembaca aktif bulanan</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Kurator Aktif
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">1.5K+</p>
                    <p className="mt-1 text-xs text-slate-500">Editor dan reviewer</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  United Voices
                </p>
                <h2 className="mt-2 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  Tim Kurasi yang Bikin Cerita Lebih Hidup
                </h2>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
              >
                Lihat Tim
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {audienceCards.map((member) => (
                <article
                  key={member.name}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.9)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-primary">
                    {member.role}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{member.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-14 overflow-hidden rounded-3xl bg-black px-6 py-10 text-white sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Weekly Newsletter
                </p>
                <h2 className="mt-3 text-[clamp(1.9rem,4.2vw,3rem)] font-black leading-[1.02] tracking-[-0.03em]">
                  Mau Dapat Rekomendasi Bacaan Terbaru?
                </h2>
                <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                  Dapatkan ringkasan tren buku, koleksi pilihan editor, dan promo
                  eksklusif langsung ke email kamu setiap minggu.
                </p>

                <form className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Masukkan email kamu"
                    className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-slate-300 focus:border-blue-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="relative min-h-[190px] overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5">
                <Image
                  src="https://images.unsplash.com/photo-1551029506-0807df4e2031?w=900&h=700&fit=crop"
                  alt="Microphone podcast"
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <p className="text-sm font-semibold">BookTalk Session</p>
                  <p className="mt-1 text-xs text-slate-300">
                    Update mingguan dari editor dan komunitas pembaca.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Why Erlangmedia
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                Kenapa Pembaca Betah di Sini?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Kami fokus pada pengalaman membaca dari ujung ke ujung, mulai dari
                pemilihan judul sampai buku sampai di tanganmu.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-xl font-semibold text-slate-900">17.5M+</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    Reader Reach
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-xl font-semibold text-slate-900">{totalBooks}+</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    Koleksi Aktif
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Star className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-xl font-semibold text-slate-900">4.9/5</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    User Rating
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {editorialBlocks.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Testimonials
              </p>
              <h2 className="mt-2 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                Shine Bright, Speak Loud
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 text-primary"
                        style={{ fill: "currentColor" }}
                      />
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    {testimonial.role}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="katalog"
            className="mt-14 scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Trending Topics
                </p>
                <h2 className="mt-2 text-[clamp(1.9rem,4.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  Tap into Fresh Titles
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  {q
                    ? `Menampilkan hasil pencarian untuk \"${q}\".`
                    : "Pilih kategori favoritmu atau cari judul buku secara langsung."}
                </p>
              </div>

              <Link
                href={buildHomeHref()}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition hover:text-primary-dark"
              >
                Reset Filter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="max-w-xl">
              <Suspense
                fallback={<div className="h-[54px] w-full rounded-2xl border border-slate-300 bg-white" />}
              >
                <SearchBar />
              </Suspense>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={buildHomeHref(q)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  !category
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-primary"
                }`}
              >
                Semua
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildHomeHref(q, cat.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    category === cat.id
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {books.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Buku tidak ditemukan
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Coba ganti kata kunci atau pilih kategori yang berbeda.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {books.map((book) => {
                    const avg =
                      book.reviews.length > 0
                        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
                          book.reviews.length
                        : 0;

                    return (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        price={book.price}
                        imageUrl={book.imageUrl}
                        category={book.category.name}
                        stock={book.stock}
                        avgRating={avg}
                        reviewCount={book.reviews.length}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    buildHref={buildCatalogPageHref}
                  />
                ) : null}
              </>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
