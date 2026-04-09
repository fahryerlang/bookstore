"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReview(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await requireAuth();

  const bookId = String(formData.get("bookId") ?? "").trim();
  const orderId = String(formData.get("orderId") ?? "").trim();
  const ratingStr = String(formData.get("rating") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!bookId || !orderId) {
    return { success: false, message: "Data buku atau pesanan tidak lengkap." };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Rating harus antara 1-5 bintang." };
  }

  try {
    // Verify user owns this order and it's completed
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.id,
        status: "COMPLETED",
      },
      include: {
        items: { where: { bookId }, take: 1 },
      },
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan atau belum selesai." };
    }

    if (order.items.length === 0) {
      return { success: false, message: "Buku ini tidak ada dalam pesanan tersebut." };
    }

    // Check if already reviewed
    const existing = await prisma.review.findUnique({
      where: {
        userId_bookId_orderId: {
          userId: session.id,
          bookId,
          orderId,
        },
      },
    });

    if (existing) {
      return { success: false, message: "Anda sudah memberikan review untuk buku ini." };
    }

    await prisma.review.create({
      data: {
        userId: session.id,
        bookId,
        orderId,
        rating,
        comment: comment || null,
      },
    });

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/dashboard/books");
    revalidatePath("/");
    return { success: true, message: "Review berhasil ditambahkan!" };
  } catch {
    return { success: false, message: "Gagal menambahkan review." };
  }
}
