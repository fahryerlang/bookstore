import { notFound } from "next/navigation";
import InvoiceView from "@/components/InvoiceView";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import { markInvoiceAsSent, voidInvoice } from "@/lib/actions/invoices";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface AdminInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInvoicePage({ params }: AdminInvoicePageProps) {
  await requireAdmin();
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { orderId: id },
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
      backHref="/admin/orders"
      backLabel="Kembali ke pesanan"
      eyebrow="Admin Invoice"
      title="Invoice Transaksi"
      description="Panel admin menampilkan detail invoice, histori event, dan kontrol dokumen untuk operasional order." 
      invoice={invoice}
      actions={
        <>
          <PrintInvoiceButton />

          {invoice.status !== "VOID" ? (
            <form action={markInvoiceAsSent.bind(null, invoice.id)}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary-100"
              >
                Tandai terkirim
              </button>
            </form>
          ) : null}

          {invoice.status !== "PAID" && invoice.status !== "VOID" ? (
            <form action={voidInvoice.bind(null, invoice.id)}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100"
              >
                Void invoice
              </button>
            </form>
          ) : null}
        </>
      }
    />
  );
}