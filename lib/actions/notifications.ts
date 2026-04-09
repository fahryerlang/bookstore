"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUnreadNotificationCount() {
  const session = await requireAuth();

  return prisma.notification.count({
    where: {
      userId: session.id,
      isRead: false,
    },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await requireAuth();

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: session.id,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
}

export async function markAllNotificationsAsRead() {
  const session = await requireAuth();

  await prisma.notification.updateMany({
    where: {
      userId: session.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

export async function createOrderStatusNotification(
  userId: string,
  orderId: string,
  orderNumber: string | null,
  newStatus: string
) {
  const statusLabel = ORDER_STATUS_LABELS[newStatus] ?? newStatus;
  const displayNumber = orderNumber ?? orderId.slice(0, 8);

  const titles: Record<string, string> = {
    PROCESSING: "Pesanan Sedang Diproses",
    SHIPPED: "Pesanan Sedang Dikirim",
    COMPLETED: "Pesanan Selesai",
  };

  const messages: Record<string, string> = {
    PROCESSING: `Pesanan ${displayNumber} sedang dikemas dan diproses.`,
    SHIPPED: `Pesanan ${displayNumber} sudah dikirim! Pantau pengiriman Anda.`,
    COMPLETED: `Pesanan ${displayNumber} telah selesai. Terima kasih sudah berbelanja!`,
  };

  await prisma.notification.create({
    data: {
      userId,
      type: "ORDER_STATUS",
      title: titles[newStatus] ?? `Status Pesanan: ${statusLabel}`,
      message: messages[newStatus] ?? `Status pesanan ${displayNumber} berubah menjadi ${statusLabel}.`,
      data: JSON.stringify({ orderId, orderNumber, status: newStatus }),
    },
  });
}
