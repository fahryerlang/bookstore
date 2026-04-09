"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(bookId: string) {
  const session = await requireAuth();

  try {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_bookId: {
          userId: session.id,
          bookId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      revalidatePath(`/books/${bookId}`);
      revalidatePath("/dashboard/books");
      revalidatePath("/dashboard/wishlist");
      return { success: true, wishlisted: false, message: "Dihapus dari wishlist." };
    }

    await prisma.wishlist.create({
      data: {
        userId: session.id,
        bookId,
      },
    });

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard/wishlist");
    return { success: true, wishlisted: true, message: "Ditambahkan ke wishlist!" };
  } catch {
    return { success: false, wishlisted: false, message: "Gagal mengubah wishlist." };
  }
}
