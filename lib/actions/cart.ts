"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

/**
 * Menambahkan buku ke keranjang belanja pengguna.
 *
 * @param {string} bookId - ID buku yang akan ditambahkan.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function addToCart(bookId: string) {
  const session = await requireAuth();

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book || book.stock <= 0) {
      return { success: false, message: "Buku tidak tersedia." };
    }

    const existing = await prisma.cartItem.findFirst({
      where: { userId: session.id, bookId },
    });

    if (existing) {
      if (existing.quantity >= book.stock) {
        return { success: false, message: "Stok tidak mencukupi." };
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: session.id, bookId, quantity: 1 },
      });
    }

    revalidatePath("/cart");
    return { success: true, message: "Buku ditambahkan ke keranjang." };
  } catch (error) {
    console.error("Gagal menambah ke keranjang:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Memperbarui jumlah item di keranjang.
 *
 * @param {string} cartItemId - ID item keranjang.
 * @param {number} quantity - Jumlah baru.
 */
export async function updateCartItem(cartItemId: string, quantity: number) {
  await requireAuth();

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    revalidatePath("/cart");
    return { success: true, message: "Keranjang diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui keranjang:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Menghapus item dari keranjang.
 *
 * @param {string} cartItemId - ID item keranjang.
 */
export async function removeFromCart(cartItemId: string) {
  await requireAuth();

  try {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    revalidatePath("/cart");
    return { success: true, message: "Item dihapus dari keranjang." };
  } catch (error) {
    console.error("Gagal menghapus dari keranjang:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
