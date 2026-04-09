import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const HOME_BOOKS_PER_PAGE = 15;

function buildBookFilters(q?: string, categoryId?: string) {
  return {
    ...(q && {
      OR: [{ title: { contains: q } }, { author: { contains: q } }],
    }),
    ...(categoryId && { categoryId }),
  };
}

export const getCachedHomeCatalogData = unstable_cache(
  async (q: string | null, categoryId: string | null, page: number) => {
    const bookFilters = buildBookFilters(q ?? undefined, categoryId ?? undefined);

    const [books, categories, totalBooks, totalCategories, filteredBookCount, highlightBooks] =
      await Promise.all([
        prisma.book.findMany({
          where: bookFilters,
          select: {
            id: true,
            title: true,
            author: true,
            price: true,
            imageUrl: true,
            stock: true,
            category: {
              select: { name: true },
            },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * HOME_BOOKS_PER_PAGE,
          take: HOME_BOOKS_PER_PAGE,
        }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.book.count(),
        prisma.category.count(),
        prisma.book.count({ where: bookFilters }),
        prisma.book.findMany({
          where: bookFilters,
          select: {
            id: true,
            title: true,
            author: true,
            price: true,
            imageUrl: true,
            stock: true,
            category: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return {
      books,
      categories,
      totalBooks,
      totalCategories,
      filteredBookCount,
      highlightBooks,
    };
  },
  ["public-home-catalog"],
  {
    revalidate: 300,
    tags: ["books", "categories"],
  }
);