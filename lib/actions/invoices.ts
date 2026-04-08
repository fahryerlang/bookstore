"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateInvoicePaths(orderId: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}/invoice`);
  revalidatePath(`/dashboard/orders/${orderId}/invoice`);
  revalidatePath("/checkout/success");
}

export async function markInvoiceAsSent(invoiceId: string) {
  const admin = await requireAdmin();

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true, orderId: true, status: true },
    });

    if (!invoice) {
      return;
    }

    if (invoice.status === "VOID") {
      return;
    }

    const sentAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          sentAt,
          ...(invoice.status === "ISSUED" ? { status: "SENT" } : {}),
        },
      });

      await tx.invoiceEvent.create({
        data: {
          invoiceId: invoice.id,
          eventType: "SENT",
          actorUserId: admin.id,
          actorLabel: admin.name,
        },
      });
    });

    revalidateInvoicePaths(invoice.orderId);
  } catch (error) {
    console.error("Gagal menandai invoice terkirim:", error);
  }
}

export async function voidInvoice(invoiceId: string) {
  const admin = await requireAdmin();

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true, orderId: true, status: true },
    });

    if (!invoice) {
      return;
    }

    if (invoice.status === "PAID") {
      return;
    }

    if (invoice.status === "VOID") {
      return;
    }

    const voidedAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "VOID",
          voidedAt,
        },
      });

      await tx.invoiceEvent.create({
        data: {
          invoiceId: invoice.id,
          eventType: "VOIDED",
          actorUserId: admin.id,
          actorLabel: admin.name,
        },
      });
    });

    revalidateInvoicePaths(invoice.orderId);
  } catch (error) {
    console.error("Gagal melakukan void invoice:", error);
  }
}