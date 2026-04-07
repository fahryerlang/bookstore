import prisma from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import CategoryForm from "./CategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";

interface CategoriesPageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const { edit } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { books: true } } },
  });
  const editingCategory = edit
    ? categories.find((category) => category.id === edit) ?? null
    : null;

  const totalBookMappings = categories.reduce(
    (sum, category) => sum + category._count.books,
    0
  );
  const emptyCategoryCount = categories.filter(
    (category) => category._count.books === 0
  ).length;
  const maxBooksInCategory =
    categories.length > 0
      ? Math.max(...categories.map((category) => category._count.books))
      : 1;
  const busiestCategory = categories.reduce<
    (typeof categories)[number] | null
  >(
    (best, category) => {
      if (!best || category._count.books > best._count.books) {
        return category;
      }

      return best;
    },
    null
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.7)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Category Management
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.75rem)] font-black tracking-[-0.03em] text-slate-900">
              Manajemen Kategori
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Susun struktur katalog agar pencarian buku lebih cepat, rapi, dan
              relevan untuk pelanggan.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Kategori
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{categories.length}</p>
              <p className="mt-1 text-xs text-slate-500">Kategori aktif di toko</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Buku Terpetakan
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalBookMappings}</p>
              <p className="mt-1 text-xs text-slate-500">Semua relasi buku-kategori</p>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                Kategori Kosong
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-800">{emptyCategoryCount}</p>
              <p className="mt-1 text-xs text-amber-700">Perlu diisi buku atau dihapus</p>
            </article>
            <article className="rounded-2xl border border-primary/20 bg-primary-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Kategori Terpadat
              </p>
              <p className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
                {busiestCategory?.name ?? "-"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {busiestCategory ? `${busiestCategory._count.books} buku` : "Belum ada data"}
              </p>
            </article>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <CategoryForm
            key={editingCategory?.id ?? "create-category"}
            category={
              editingCategory
                ? { id: editingCategory.id, name: editingCategory.name }
                : undefined
            }
          />

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-42px_rgba(15,23,42,0.65)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Saran Struktur
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Buat nama kategori singkat dan spesifik. Hindari duplikasi topik agar
              navigasi katalog tetap jelas untuk pelanggan.
            </p>
          </article>
        </div>

        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar Kategori</h2>
                <p className="mt-0.5 text-xs text-slate-500">{categories.length} kategori terdaftar</p>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  <FolderOpen className="h-7 w-7 text-slate-400" />
                </div>
                <p className="font-medium text-slate-600">Belum ada kategori</p>
                <p className="mt-1 text-sm text-slate-500">Buat kategori pertama menggunakan form di samping.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                      <th className="px-6 py-4">Nama</th>
                      <th className="px-6 py-4">Jumlah Buku</th>
                      <th className="px-6 py-4">Tanggal Dibuat</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className={`transition-colors hover:bg-slate-50 ${
                          editingCategory?.id === cat.id ? "bg-primary-50/40" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary-50">
                              <FolderOpen className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {cat._count.books} buku
                            </span>
                            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${
                                    cat._count.books === 0
                                      ? 0
                                      : Math.max(
                                          (cat._count.books / maxBooksInCategory) * 100,
                                          10
                                        )
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(cat.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/categories?edit=${cat.id}`}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                editingCategory?.id === cat.id
                                  ? "border border-primary/30 bg-primary text-white"
                                  : "border border-primary/20 bg-primary-50 text-primary hover:bg-primary-100"
                              }`}
                            >
                              {editingCategory?.id === cat.id ? "Sedang Diedit" : "Edit"}
                            </Link>
                            <DeleteCategoryButton id={cat.id} name={cat.name} />
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
      </div>
    </div>
  );
}
