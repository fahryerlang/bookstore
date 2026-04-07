import prisma from "@/lib/prisma";
import Image from "next/image";
import { BookOpen, Plus, Package } from "@/components/icons";
import { formatRupiah, formatDate } from "@/lib/utils";
import Link from "next/link";
import DeleteBookButton from "./DeleteBookButton";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
  const outOfStockCount = books.filter((book) => book.stock === 0).length;
  const lowStockCount = books.filter(
    (book) => book.stock > 0 && book.stock <= 5
  ).length;
  const averagePrice =
    books.length > 0
      ? Math.round(
          books.reduce((sum, book) => sum + book.price, 0) / books.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Books Management
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] font-black tracking-[-0.03em] text-slate-900">
              Manajemen Buku
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Kendalikan inventori, kualitas stok, dan nilai jual produk dalam satu
              tampilan yang ringkas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Dashboard Admin
            </Link>

            <Link
              href="/admin/books/new"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              Tambah Buku
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Total Buku
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{books.length}</p>
            <p className="mt-1 text-xs text-slate-500">Produk terdaftar</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Total Stok
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalStock}</p>
            <p className="mt-1 text-xs text-slate-500">Unit siap jual</p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Stok Menipis
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-800">{lowStockCount}</p>
            <p className="mt-1 text-xs text-amber-700">Buku dengan stok 1-5</p>
          </article>
          <article className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
              Kehabisan Stok
            </p>
            <p className="mt-1 text-2xl font-bold text-red-800">{outOfStockCount}</p>
            <p className="mt-1 text-xs text-red-700">Perlu restock segera</p>
          </article>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900">
          <BookOpen className="h-3.5 w-3.5" />
          Rata-rata harga buku {formatRupiah(averagePrice)}
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        {books.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <Package className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-medium text-slate-600">Belum ada buku</p>
            <p className="mt-1 text-sm text-slate-500">Tambahkan buku pertama Anda untuk mulai berjualan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-6 py-4">Buku</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((book) => (
                  <tr key={book.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                          <Image
                            src={book.imageUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="max-w-60 truncate text-sm font-semibold text-slate-900">
                            {book.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {book.author ?? "Penulis belum diisi"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">ID #{book.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg border border-primary/20 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-900">
                        {book.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatRupiah(book.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          book.stock > 5
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : book.stock > 0
                              ? "border border-amber-200 bg-amber-50 text-amber-700"
                              : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            book.stock > 5
                              ? "bg-emerald-500"
                              : book.stock > 0
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        {book.stock > 0 ? `${book.stock} unit` : "Habis"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(book.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="rounded-lg border border-primary/20 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-100"
                        >
                          Edit
                        </Link>
                        <DeleteBookButton id={book.id} title={book.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
