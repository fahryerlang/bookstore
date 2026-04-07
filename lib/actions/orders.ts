"use server";

import prisma from "@/lib/prisma";
import {
  getPaymentOption,
  getShippingOption,
  serializeCheckoutSnapshot,
} from "@/lib/checkout";
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
  const selectedCartItemIds = formData
    .getAll("selectedCartItemIds")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const shippingAddress = String(formData.get("shippingAddress") ?? "").trim();
  const shippingServiceId = String(formData.get("shippingService") ?? "").trim();
  const paymentMethodId = String(formData.get("paymentMethod") ?? "").trim();
  const orderNotes = String(formData.get("orderNotes") ?? "").trim();

  if (!recipientName || !contactEmail || !phoneNumber || !shippingAddress) {
    return {
      success: false,
      message: "Lengkapi nama penerima, email, nomor telepon, dan alamat pengiriman.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+()\-\s]{8,20}$/;

  if (!emailPattern.test(contactEmail)) {
    return { success: false, message: "Format email belum valid." };
  }

  if (!phonePattern.test(phoneNumber)) {
    return { success: false, message: "Nomor telepon belum valid." };
  }

  const shippingOption = getShippingOption(shippingServiceId);
  const paymentOption = getPaymentOption(paymentMethodId);

  if (!shippingOption) {
    return { success: false, message: "Pilih layanan pengiriman yang tersedia." };
  }

  if (!paymentOption) {
    return { success: false, message: "Pilih metode pembayaran yang tersedia." };
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.id,
        ...(selectedCartItemIds.length > 0 ? { id: { in: selectedCartItemIds } } : {}),
      },
      include: { book: true },
    });

    if (cartItems.length === 0) {
      return { success: false, message: "Belum ada item yang dipilih untuk checkout." };
    }

    const subtotalAmount = cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const shippingFee = shippingOption.fee;
    const serviceFee = paymentOption.fee;
    const totalAmount = subtotalAmount + shippingFee + serviceFee;
    const initialStatus = paymentOption.id === "cod" ? "PROCESSING" : "PENDING_PAYMENT";

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
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.id,
          totalAmount,
          status: initialStatus,
          shippingAddress: serializeCheckoutSnapshot({
            recipientName,
            contactEmail,
            phoneNumber,
            shippingService: shippingOption.id,
            paymentMethod: paymentOption.id,
            subtotalAmount,
            shippingFee,
            serviceFee,
            address: shippingAddress,
            orderNotes: orderNotes || undefined,
          }),
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
        where: {
          userId: session.id,
          id: { in: cartItems.map((item) => item.id) },
        },
      });

      return order;
    });

    revalidatePath("/cart");
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/checkout");
    redirect(`/checkout/success?order=${createdOrder.id}`);
  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
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
