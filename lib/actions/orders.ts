"use server";

import prisma from "@/lib/prisma";
import { getInvoiceDueDate, getNextDocumentNumber } from "@/lib/documents";
import {
  getPaymentOption,
  getShippingOption,
  serializeCheckoutSnapshot,
} from "@/lib/checkout";
import {
  canAdvanceOrderStatus,
  isFinalOrderStatus,
  isManagedOrderStatus,
  type ManagedOrderStatus,
} from "@/lib/order-status";
import { revalidatePath } from "next/cache";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrderStatusNotification } from "@/lib/actions/notifications";

function getStatusUpdateTimestamp() {
  return new Date();
}

function stringifyMetadata(payload: Record<string, unknown>) {
  return JSON.stringify(payload);
}

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
      include: {
        book: {
          include: {
            category: true,
          },
        },
      },
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
    const initialPaymentStatus = paymentOption.id === "cod" ? "COD_PENDING" : "UNPAID";
    const createdAt = new Date();
    const rawCheckoutSnapshot = serializeCheckoutSnapshot({
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
    });

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
      const orderNumber = await getNextDocumentNumber(tx, "ORDER", createdAt);
      const invoiceNumber = await getNextDocumentNumber(tx, "INVOICE", createdAt);
      const dueDate = getInvoiceDueDate(paymentOption.id, createdAt);

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.id,
          totalAmount,
          subtotalAmount,
          discountAmount: 0,
          shippingFeeAmount: shippingFee,
          serviceFeeAmount: serviceFee,
          taxAmount: 0,
          status: initialStatus,
          paymentStatus: initialPaymentStatus,
          billingName: recipientName,
          billingEmail: contactEmail,
          billingPhone: phoneNumber,
          billingAddress: shippingAddress,
          shippingName: recipientName,
          shippingEmail: contactEmail,
          shippingPhone: phoneNumber,
          shippingAddress,
          paymentMethodId: paymentOption.id,
          paymentMethodLabel: paymentOption.label,
          shippingMethodId: shippingOption.id,
          shippingMethodLabel: shippingOption.label,
          notes: orderNotes || null,
          rawCheckoutSnapshot,
          dataCompleteness: "FULL",
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => {
          const lineSubtotal = item.book.price * item.quantity;

          return {
            orderId: order.id,
            bookId: item.bookId,
            categoryId: item.book.categoryId,
            productTitleSnapshot: item.book.title,
            authorSnapshot: item.book.author,
            categoryNameSnapshot: item.book.category?.name ?? null,
            imageUrlSnapshot: item.book.imageUrl,
            unitPriceSnapshot: item.book.price,
            unitCostSnapshot: item.book.costPrice,
            quantity: item.quantity,
            lineSubtotal,
            lineDiscountAmount: 0,
            lineTaxAmount: 0,
            lineTotal: lineSubtotal,
          };
        }),
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,
          status: "ISSUED",
          subtotalAmount,
          discountAmount: 0,
          shippingFeeAmount: shippingFee,
          serviceFeeAmount: serviceFee,
          taxAmount: 0,
          totalAmount,
          billingName: recipientName,
          billingEmail: contactEmail,
          billingPhone: phoneNumber,
          billingAddress: shippingAddress,
          shippingName: recipientName,
          shippingEmail: contactEmail,
          shippingPhone: phoneNumber,
          shippingAddress,
          dueDate,
          notes: orderNotes || null,
        },
      });

      await tx.invoiceItem.createMany({
        data: cartItems.map((item) => {
          const lineSubtotal = item.book.price * item.quantity;

          return {
            invoiceId: invoice.id,
            descriptionSnapshot: item.book.title,
            quantity: item.quantity,
            unitPriceSnapshot: item.book.price,
            lineSubtotal,
            lineDiscountAmount: 0,
            lineTaxAmount: 0,
            lineTotal: lineSubtotal,
          };
        }),
      });

      await tx.invoiceEvent.create({
        data: {
          invoiceId: invoice.id,
          eventType: "CREATED",
          actorUserId: session.id,
          actorLabel: session.name,
          metadataJson: stringifyMetadata({
            orderId: order.id,
            orderNumber,
            source: "checkout",
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
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/profile");
    revalidatePath("/profile");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/reports");
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
  status: ManagedOrderStatus
) {
  await requireAdmin();

  try {
    if (!isManagedOrderStatus(status)) {
      return { success: false, message: "Status pesanan tidak dikenali." };
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        paymentStatus: true,
        paymentMethodId: true,
        userId: true,
        orderNumber: true,
      },
    });

    if (!existingOrder || !isManagedOrderStatus(existingOrder.status)) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    if (existingOrder.status === status) {
      return { success: true, message: "Status pesanan tetap sama." };
    }

    if (isFinalOrderStatus(existingOrder.status)) {
      return {
        success: false,
        message: "Pesanan yang sudah selesai tidak bisa diubah kembali.",
      };
    }

    if (!canAdvanceOrderStatus(existingOrder.status, status)) {
      return {
        success: false,
        message: "Status pesanan hanya bisa maju satu langkah dan tidak bisa kembali.",
      };
    }

    const changedAt = getStatusUpdateTimestamp();
    const shouldMarkNonCodPaid =
      existingOrder.status === "PENDING_PAYMENT" && status === "PROCESSING";
    const shouldMarkCodPaid =
      existingOrder.paymentMethodId === "cod" && status === "COMPLETED";
    const shouldMarkPaid = shouldMarkNonCodPaid || shouldMarkCodPaid;

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(status === "COMPLETED" ? { completedAt: changedAt } : {}),
          ...(shouldMarkPaid
            ? {
                paymentStatus: "PAID",
                paidAt: changedAt,
              }
            : {}),
        },
      });

      const latestInvoice = await tx.invoice.findFirst({
        where: { orderId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (latestInvoice && shouldMarkPaid) {
        await tx.invoice.update({
          where: { id: latestInvoice.id },
          data: {
            status: "PAID",
            paidAt: changedAt,
          },
        });

        await tx.invoiceEvent.create({
          data: {
            invoiceId: latestInvoice.id,
            eventType: "PAID",
            actorLabel: "Admin",
            metadataJson: stringifyMetadata({
              orderId,
              paidVia: existingOrder.paymentMethodId ?? "manual-review",
              status,
            }),
          },
        });
      }
    });

    // Create notification for user
    try {
      await createOrderStatusNotification(
        existingOrder.userId,
        orderId,
        existingOrder.orderNumber,
        status
      );
    } catch {
      // Non-critical: don't fail the status update if notification fails
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/reports");
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}/track`);
    revalidatePath(`/admin/orders/${orderId}/invoice`);
    revalidatePath(`/dashboard/orders/${orderId}/invoice`);
    return { success: true, message: "Status pesanan diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui status:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
