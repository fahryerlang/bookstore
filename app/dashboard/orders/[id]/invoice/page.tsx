import { notFound } from "next/navigation";
import InvoiceView from "@/components/InvoiceView";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface UserInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserInvoicePage({ params }: UserInvoicePageProps) {
  const session = await requireAuth();
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: {
      orderId: id,
      order: {
        userId: session.id,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          paymentMethodLabel: true,
          shippingMethodLabel: true,
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
      },
      events: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <InvoiceView
      backHref="/dashboard/orders"
      backLabel="Kembali ke riwayat"
      eyebrow="Customer Invoice"
      title="Invoice Pesanan Anda"
      description="Invoice ini dapat dipakai sebagai referensi pembayaran, bukti transaksi, dan arsip pembelian pribadi." 
      invoice={invoice}
      actions={<PrintInvoiceButton />}
    />
  );
}