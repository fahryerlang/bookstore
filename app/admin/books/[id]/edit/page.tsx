import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "@/components/icons";
import BookForm from "../../new/BookForm";

/**
 * Props untuk halaman edit buku.
 */
interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman edit buku (Admin).
 */
export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) notFound();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_85px_-58px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Catalog Maintenance
            </p>
            <h1 className="mt-2 text-[clamp(1.85rem,4vw,2.75rem)] font-black tracking-[-0.03em] text-slate-900">
              Edit Buku
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Perbarui detail buku &quot;{book.title}&quot; dengan tampilan editor yang sama rapi dan
              fokus seperti halaman tambah buku.
            </p>
          </div>

          <Link
            href="/admin/books"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Buku
          </Link>
        </div>

        <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900">
          <Pencil className="h-3.5 w-3.5" />
          Mode pembaruan katalog aktif
        </div>
      </section>

      <BookForm categories={categories} book={book} />
    </div>
  );
}
