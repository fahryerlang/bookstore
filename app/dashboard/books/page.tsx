import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { BookOpen, Search, Sparkles } from "@/components/icons";

interface UserBooksPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

function buildBooksHref(q?: string, categoryId?: string) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (categoryId) {
    params.set("category", categoryId);
  }

  const query = params.toString();
  return query ? `/dashboard/books?${query}` : "/dashboard/books";
}

export default async function UserBooksPage({ searchParams }: UserBooksPageProps) {
  const { q, category } = await searchParams;

  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      where: {
        ...(q && { title: { contains: q } }),
        ...(category && { categoryId: category }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.7)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Curated Shelves
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] font-black tracking-[-0.03em] text-slate-900">
              Katalog Buku Pilihan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Jelajahi judul terbaru dalam tampilan flex yang ringan, modern, dan cepat dipindai.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
            <Sparkles className="h-3.5 w-3.5" />
            {books.length} buku ditemukan
          </div>
        </div>

        <form method="get" className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari judul buku..."
              className="h-11 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            name="category"
            defaultValue={category ?? ""}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
          >
            <option value="">Semua kategori</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="h-11 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Terapkan Filter
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildBooksHref(q)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              !category
                ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700"
            }`}
          >
            Semua
          </Link>
          {categories.map((item) => {
            const active = category === item.id;

            return (
              <Link
                key={item.id}
                href={buildBooksHref(q, item.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  active
                    ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        {books.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <BookOpen className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-medium text-slate-700">Belum ada buku yang cocok dengan filter.</p>
            <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci atau pilih kategori lainnya.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 p-6">
            {books.map((book) => (
              <article
                key={book.id}
                className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-44px_rgba(15,23,42,0.65)] transition duration-200 hover:-translate-y-1 hover:border-cyan-300 sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.75rem)]"
              >
                <div className="relative aspect-[5/4] overflow-hidden border-b border-slate-200 bg-slate-100">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <span className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-800">
                    {book.category.name}
                  </span>

                  <h3 className="mt-3 line-clamp-2 text-base font-bold leading-tight text-slate-900">
                    {book.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {book.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{formatRupiah(book.price)}</p>
                      <p
                        className={`text-xs font-semibold ${
                          book.stock > 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {book.stock > 0 ? `Stok ${book.stock} unit` : "Stok habis"}
                      </p>
                    </div>

                    <Link
                      href={`/books/${book.id}`}
                      className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-800 transition hover:bg-cyan-100"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
