import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { resolveOrderPresentation } from "@/lib/orders";
import { formatDate, formatRupiah } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "@/components/icons";
import Link from "next/link";

/**
 * Halaman konfirmasi setelah pesanan berhasil dibuat.
 */
interface CheckoutSuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const session = await requireAuth();
  const { order } = await searchParams;

  let latestOrder = null;

  if (order) {
    latestOrder = await prisma.order.findFirst({
      where: { id: order, userId: session.id },
      include: {
        invoices: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { id: true, invoiceNumber: true },
        },
      },
    });
  }

  if (!latestOrder) {
    latestOrder = await prisma.order.findFirst({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      include: {
        invoices: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { id: true, invoiceNumber: true },
        },
      },
    });
  }

  const orderPresentation = latestOrder
    ? resolveOrderPresentation(latestOrder, session)
    : null;
  const latestInvoice = latestOrder?.invoices?.[0] ?? null;
  const recipientName = orderPresentation?.recipientName ?? session.name;
  const contactEmail = orderPresentation?.contactEmail ?? session.email;
  const phoneNumber = orderPresentation?.phoneNumber ?? "Belum tercatat";
  const paymentMethod = orderPresentation?.paymentMethodLabel ?? "Metode belum tercatat";
  const shippingService = orderPresentation?.shippingMethodLabel ?? "Kurir belum tercatat";
  const shippingAddress = orderPresentation?.shippingAddress ?? "Alamat belum tersedia.";
  const subtotalAmount = orderPresentation?.subtotalAmount ?? latestOrder?.totalAmount ?? 0;
  const shippingFee = orderPresentation?.shippingFeeAmount ?? 0;
  const serviceFee = orderPresentation?.serviceFeeAmount ?? 0;
  const totalAmount = latestOrder?.totalAmount || 0;
  const needsPaymentFollowUp = latestOrder?.status === "PENDING_PAYMENT";

  return (
    <div className="space-y-6">
      <section className="editorial-surface-dark relative overflow-hidden rounded-[32px] px-6 py-10 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl animate-drift-slow" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 text-emerald-300" />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100">
              Order Confirmed
            </p>
            <h1 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] font-black leading-[0.96] tracking-[-0.04em] text-white">
              Pesanan berhasil dibuat dan siap masuk ke alur berikutnya.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {needsPaymentFollowUp
                ? `Selesaikan pembayaran melalui ${paymentMethod} agar tim kami dapat segera melanjutkan proses packing.`
                : `Pesanan dengan ${paymentMethod} langsung masuk ke tahap proses. Tim kami akan menyiapkan pengiriman secepatnya.`}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
              Ringkasan akhir
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
              {formatRupiah(totalAmount)}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Pembayaran
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{paymentMethod}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Pengiriman
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{shippingService}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="editorial-surface rounded-[28px] p-6 sm:p-7">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Penerima</p>
              <p className="mt-1 text-sm text-slate-600">{recipientName}</p>
              <p className="mt-1 text-xs text-slate-500">{phoneNumber}</p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                <CreditCard className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Pembayaran</p>
              <p className="mt-1 text-sm text-slate-600">{paymentMethod}</p>
              <p className="mt-1 text-xs text-slate-500">
                {needsPaymentFollowUp ? "Menunggu pelunasan" : "Siap diproses"}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                <Truck className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Kurir</p>
              <p className="mt-1 text-sm text-slate-600">{shippingService}</p>
              <p className="mt-1 text-xs text-slate-500">{formatRupiah(shippingFee)} ongkir</p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Waktu dibuat</p>
              <p className="mt-1 text-sm text-slate-600">
                {latestOrder ? formatDate(latestOrder.createdAt) : "Baru saja"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{contactEmail}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Alamat Pengiriman
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {shippingAddress}
              </p>

              {orderPresentation?.orderNotes ? (
                <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Catatan Pesanan
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {orderPresentation.orderNotes}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50/85 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Price Breakdown
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal buku</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(subtotalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ongkir</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Biaya layanan</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(serviceFee)}</span>
                </div>
              </div>
              <div className="mt-5 rounded-[22px] border border-primary/10 bg-primary-50 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">Total akhir</span>
                  <span className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {latestOrder && latestInvoice ? (
            <Link
              href={`/dashboard/orders/${latestOrder.id}/invoice`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
            >
              Lihat Invoice {latestInvoice.invoiceNumber}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}

          <section className="editorial-surface rounded-[24px] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Next Step
            </p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {needsPaymentFollowUp
                ? "Selesaikan pembayaran dan tunggu verifikasi otomatis."
                : "Pesanan sudah masuk antrian proses dan siap disiapkan."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Anda tetap bisa memantau perkembangan pesanan dari dashboard pengguna dan panel admin akan melihat data checkout yang lebih lengkap.
            </p>
          </section>

          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary"
          >
            Lihat Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard/books"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Lanjut Belanja
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
