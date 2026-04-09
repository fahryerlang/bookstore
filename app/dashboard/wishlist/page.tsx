import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import WishlistButton from "@/components/WishlistButton";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatDate, formatRupiah } from "@/lib/utils";
import { BookOpen, Heart, Sparkles, Star } from "@/components/icons";

const WISHLIST_PAGE_SIZE = 12;

interface UserWishlistPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UserWishlistPage({ searchParams }: UserWishlistPageProps) {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [wishlistItems, totalCount] = await Promise.all([
    prisma.wishlist.findMany({
      where: { userId: session.id },
      include: {
        book: {
          include: {
            category: true,
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * WISHLIST_PAGE_SIZE,
      take: WISHLIST_PAGE_SIZE,
    }),
    prisma.wishlist.count({ where: { userId: session.id } }),
  ]);

  const totalPages = Math.ceil(totalCount / WISHLIST_PAGE_SIZE);

  function buildPageHref(nextPage: number) {
    return nextPage > 1 ? `/dashboard/wishlist?page=${nextPage}` : "/dashboard/wishlist";
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.7)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Personal Shelf
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] font-black tracking-[-0.03em] text-slate-900">
              Wishlist Saya
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Kumpulkan judul yang ingin dibeli nanti, lalu buka lagi saat siap checkout.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900">
            <Sparkles className="h-3.5 w-3.5" />
            {totalCount} buku tersimpan
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Cari Buku Lagi
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
          >
            <Heart className="h-3.5 w-3.5" />
            Lanjut ke Keranjang
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        {wishlistItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
              <Heart className="h-7 w-7" />
            </div>
            <p className="font-medium text-slate-700">Wishlist Anda masih kosong.</p>
            <p className="mt-1 text-sm text-slate-500">
              Simpan buku dari halaman detail agar mudah ditemukan lagi nanti.
            </p>
            <Link
              href="/dashboard/books"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Jelajah Katalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 p-6">
            {wishlistItems.map((item) => {
              const averageRating =
                item.book.reviews.length > 0
                  ? item.book.reviews.reduce((sum, review) => sum + review.rating, 0) /
                    item.book.reviews.length
                  : 0;

              return (
                <article
                  key={item.id}
                  className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-44px_rgba(15,23,42,0.65)] transition duration-200 hover:-translate-y-1 hover:border-primary/30 sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.75rem)]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden border-b border-slate-200 bg-slate-100">
                    <Image
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm backdrop-blur">
                      Disimpan {formatDate(item.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-900">
                      {item.book.category.name}
                    </span>

                    <h2 className="mt-3 line-clamp-2 text-base font-bold leading-tight text-slate-900">
                      {item.book.title}
                    </h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                      {item.book.author ? `Oleh ${item.book.author}` : "Penulis belum diisi"}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {item.book.description}
                    </p>

                    {averageRating > 0 ? (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-slate-400">({item.book.reviews.length})</span>
                      </div>
                    ) : null}

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {formatRupiah(item.book.price)}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            item.book.stock > 0 ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {item.book.stock > 0
                            ? `Stok ${item.book.stock} unit`
                            : "Stok habis"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <WishlistButton bookId={item.book.id} isWishlisted />
                        <Link
                          href={`/books/${item.book.id}`}
                          className="rounded-lg border border-primary/30 bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-900 transition hover:bg-primary-100"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildPageHref}
        />
      ) : null}
    </div>
  );
}