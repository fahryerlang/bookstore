import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft, Banknote, CheckCircle, CreditCard, ShieldCheck, Truck } from "@/components/icons";
import { paymentStatusLabels, resolvePaymentStatus } from "@/lib/orders";
import { formatDate, formatDateTime, formatRupiah } from "@/lib/utils";

interface InvoiceViewProps {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    issuedAt: Date;
    dueDate: Date | null;
    paidAt: Date | null;
    subtotalAmount: number;
    discountAmount: number;
    shippingFeeAmount: number;
    serviceFeeAmount: number;
    taxAmount: number;
    totalAmount: number;
    billingName: string | null;
    billingEmail: string | null;
    billingPhone: string | null;
    billingAddress: string | null;
    shippingName: string | null;
    shippingEmail: string | null;
    shippingPhone: string | null;
    shippingAddress: string;
    notes: string | null;
    order: {
      id: string;
      orderNumber: string | null;
      status: string;
      paymentStatus: string | null;
      paymentMethodLabel: string | null;
      shippingMethodLabel: string | null;
    };
    items: Array<{
      id: string;
      descriptionSnapshot: string;
      quantity: number;
      unitPriceSnapshot: number;
      lineSubtotal: number;
      lineTotal: number;
    }>;
    events: Array<{
      id: string;
      eventType: string;
      actorLabel: string | null;
      createdAt: Date;
    }>;
  };
}

const invoiceStatusLabels: Record<string, string> = {
  ISSUED: "Diterbitkan",
  SENT: "Terkirim",
  PAID: "Lunas",
  VOID: "Void",
};

const invoiceStatusTone: Record<string, string> = {
  ISSUED: "border border-amber-200 bg-amber-50 text-amber-700",
  SENT: "border border-blue-200 bg-blue-50 text-blue-700",
  PAID: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  VOID: "border border-slate-300 bg-slate-100 text-slate-600",
};

const orderStatusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

export default function InvoiceView({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  actions,
  invoice,
}: InvoiceViewProps) {
  const resolvedPaymentStatus = resolvePaymentStatus(
    invoice.order.paymentStatus,
    invoice.order.status
  );

  return (
    <div className="space-y-6 print:space-y-4">
      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] print:rounded-none print:border-0 print:p-0 print:shadow-none sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] font-black tracking-[-0.03em] text-slate-900">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Link
              href={backHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            {actions}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Informasi dokumen
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Nomor invoice
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Nomor order
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {invoice.order.orderNumber ?? `LEG-${invoice.order.id.slice(0, 8).toUpperCase()}`}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tanggal invoice
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDateTime(invoice.issuedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Jatuh tempo
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {invoice.dueDate ? formatDateTime(invoice.dueDate) : "Sesuai alur COD"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-primary/15 bg-primary-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Status transaksi
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${invoiceStatusTone[invoice.status] ?? invoiceStatusTone.ISSUED}`}
              >
                {invoiceStatusLabels[invoice.status] ?? invoice.status}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                {orderStatusLabels[invoice.order.status] ?? invoice.order.status}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                {paymentStatusLabels[resolvedPaymentStatus]}
              </span>
            </div>

            <div className="mt-5 rounded-[22px] border border-white/70 bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total tagihan
              </p>
              <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
                {formatRupiah(invoice.totalAmount)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {invoice.paidAt
                  ? `Pelunasan tercatat pada ${formatDateTime(invoice.paidAt)}.`
                  : "Gunakan invoice ini sebagai dokumen rujukan pembayaran dan operasional."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr_320px] print:grid-cols-2">
        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] print:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Billing</p>
              <p className="text-xs text-slate-500">Data penagihan pelanggan</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">{invoice.billingName ?? invoice.shippingName ?? "-"}</p>
            <p>{invoice.billingEmail ?? invoice.shippingEmail ?? "-"}</p>
            <p>{invoice.billingPhone ?? invoice.shippingPhone ?? "-"}</p>
            <p className="whitespace-pre-line">{invoice.billingAddress ?? invoice.shippingAddress}</p>
          </div>
        </article>

        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] print:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Shipping</p>
              <p className="text-xs text-slate-500">Pengiriman dan fulfillment</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">{invoice.shippingName ?? "-"}</p>
            <p>{invoice.shippingEmail ?? "-"}</p>
            <p>{invoice.shippingPhone ?? "-"}</p>
            <p className="whitespace-pre-line">{invoice.shippingAddress}</p>
            <p className="pt-2 text-xs uppercase tracking-[0.14em] text-slate-400">
              {invoice.order.shippingMethodLabel ?? "Kurir belum tercatat"}
            </p>
          </div>
        </article>

        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Metode</p>
              <p className="text-xs text-slate-500">Pembayaran dan bukti</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Metode bayar
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {invoice.order.paymentMethodLabel ?? "Belum tercatat"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Tanggal dibuat
              </p>
              <p className="mt-1 font-semibold text-slate-900">{formatDate(invoice.issuedAt)}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] print:rounded-none print:border print:shadow-none">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-lg font-semibold text-slate-900">Rincian item</p>
          <p className="mt-1 text-sm text-slate-500">Snapshot item disimpan saat transaksi dibuat, jadi histori tidak berubah walau katalog diubah.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{item.descriptionSnapshot}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatRupiah(item.unitPriceSnapshot)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatRupiah(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] print:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Audit trail invoice</p>
              <p className="text-xs text-slate-500">Jejak dokumen yang paling relevan untuk operasional</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {invoice.events.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada event tambahan untuk invoice ini.</p>
            ) : (
              invoice.events.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{event.eventType}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {event.actorLabel ? `Diproses oleh ${event.actorLabel}` : "Diproses sistem"}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[26px] border border-primary/15 bg-primary-50/70 p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.45)] print:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ringkasan biaya</p>
              <p className="text-xs text-slate-500">Dokumen ini siap dipakai untuk print, referensi pembayaran, dan arsip transaksi.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal item</span>
              <span className="font-semibold text-slate-900">{formatRupiah(invoice.subtotalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Diskon</span>
              <span className="font-semibold text-slate-900">{formatRupiah(invoice.discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ongkir</span>
              <span className="font-semibold text-slate-900">{formatRupiah(invoice.shippingFeeAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Biaya layanan</span>
              <span className="font-semibold text-slate-900">{formatRupiah(invoice.serviceFeeAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pajak</span>
              <span className="font-semibold text-slate-900">{formatRupiah(invoice.taxAmount)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-white/70 bg-white px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-slate-900">Grand total</span>
              <span className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                {formatRupiah(invoice.totalAmount)}
              </span>
            </div>
          </div>

          {invoice.notes ? (
            <div className="mt-4 rounded-[22px] border border-white/70 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Catatan
              </p>
              <p className="mt-2">{invoice.notes}</p>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}