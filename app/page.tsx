import prisma from "@/lib/prisma";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import { BookOpen, TrendingUp, Truck, Shield } from "lucide-react";

/**
 * Props untuk halaman beranda.
 */
interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/**
 * Halaman beranda yang menampilkan katalog buku dengan fitur pencarian.
 * Menggunakan Server Component untuk data fetching yang efisien.
 */
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

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Temukan Buku
              <span className="text-indigo-200"> Favoritmu</span>
            </h1>
            <p className="mt-4 text-lg text-indigo-100 leading-relaxed">
              Jelajahi koleksi buku terlengkap dari berbagai kategori.
              Dari fiksi hingga non-fiksi, semuanya ada di sini.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <Truck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Pengiriman Cepat</p>
                <p className="text-xs text-gray-500">Ke seluruh Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Transaksi Aman</p>
                <p className="text-xs text-gray-500">Pembayaran terproteksi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Harga Terbaik</p>
                <p className="text-xs text-gray-500">Diskon setiap hari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              Katalog Buku
            </h2>
            <p className="text-gray-500 mt-1">
              {q
                ? `Hasil pencarian untuk "${q}"`
                : `Menampilkan ${books.length} buku`}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

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
      </section>
    </div>
  );
}
