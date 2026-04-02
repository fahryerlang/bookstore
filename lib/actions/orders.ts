"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Membuat pesanan baru dari keranjang belanja pengguna.
 *
 * @param {unknown} _prevState - State sebelumnya.
 * @param {FormData} formData - Data formulir checkout.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function createOrder(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await requireAuth();
  const shippingAddress = formData.get("shippingAddress") as string;

  if (!shippingAddress || shippingAddress.trim() === "") {
    return { success: false, message: "Alamat pengiriman wajib diisi." };
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { book: true },
    });

    if (cartItems.length === 0) {
      return { success: false, message: "Keranjang belanja kosong." };
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );

    // Periksa stok sebelum membuat pesanan
    for (const item of cartItems) {
      if (item.quantity > item.book.stock) {
        return {
          success: false,
          message: `Stok "${item.book.title}" tidak mencukupi.`,
        };
      }
    }

    // Buat pesanan dan kurangi stok dalam transaksi
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          userId: session.id,
          totalAmount,
          shippingAddress: shippingAddress.trim(),
        },
      });

      // Kurangi stok buku
      for (const item of cartItems) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: item.book.stock - item.quantity },
        });
      }

      // Kosongkan keranjang
      await tx.cartItem.deleteMany({
        where: { userId: session.id },
      });
    });

    revalidatePath("/cart");
    revalidatePath("/");
  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }

  redirect("/checkout/success");
}

/**
 * Memperbarui status pesanan (Admin).
 *
 * @param {string} orderId - ID pesanan.
 * @param {string} status - Status baru.
 */
export async function updateOrderStatus(
  orderId: string,
  status: "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "COMPLETED"
) {
  await requireAdmin();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    return { success: true, message: "Status pesanan diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui status:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
