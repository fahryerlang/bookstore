import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, FolderOpen, Sparkles, Tag } from "@/components/icons";
import BookForm from "./BookForm";

/**
 * Halaman tambah buku baru (Admin).
 */
export default async function NewBookPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const categoryCount = categories.length;
  const firstCategory = categories[0]?.name ?? "Belum ada kategori";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_85px_-58px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Catalog Publishing
            </p>
            <h1 className="mt-2 text-[clamp(1.85rem,4vw,2.85rem)] font-black tracking-[-0.03em] text-slate-900">
              Tambah Buku Baru
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Buat entri katalog baru dengan tampilan yang lebih rapi, metadata yang jelas,
              dan preview cover sebelum buku dipublikasikan ke etalase Erlangmedia.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/admin/books"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Buku
              </Link>
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
              >
                <FolderOpen className="h-4 w-4" />
                Kelola Kategori
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Kategori Aktif
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{categoryCount}</p>
              <p className="mt-1 text-xs text-slate-500">Siap dipilih untuk buku baru</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Kategori Awal
              </p>
              <p className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
                {firstCategory}
              </p>
              <p className="mt-1 text-xs text-slate-500">Urut alfabet untuk seleksi cepat</p>
            </article>

            <article className="rounded-2xl border border-primary/20 bg-primary-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Status Draft
              </p>
              <p className="mt-1 flex items-center gap-2 text-base font-bold text-slate-900">
                <Sparkles className="h-4 w-4 text-primary" />
                {categoryCount > 0 ? "Siap Dipublikasikan" : "Butuh Kategori"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {categoryCount > 0
                  ? "Lengkapi form lalu simpan untuk menambah buku ke katalog."
                  : "Buat kategori dulu agar buku bisa dikelompokkan dengan benar."}
              </p>
            </article>
          </div>
        </div>
      </section>

      {categoryCount === 0 ? (
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-[0_16px_42px_-38px_rgba(180,83,9,0.35)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-amber-900">Kategori belum tersedia</h2>
              <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
                Form tetap bisa Anda lihat, tetapi penyimpanan buku baru akan lebih lancar setelah
                minimal satu kategori dibuat.
              </p>
            </div>
          </div>
        </article>
      ) : null}

      <BookForm categories={categories} />
    </div>
  );
}
