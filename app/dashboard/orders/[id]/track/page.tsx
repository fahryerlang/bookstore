import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate, formatDateTime, formatRupiah } from "@/lib/utils";
import { resolveOrderPresentation } from "@/lib/orders";
import { ORDER_STATUS_FLOW } from "@/lib/order-status";
import { getShippingOption } from "@/lib/checkout";
import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "@/components/icons";

interface TrackOrderPageProps {
  params: Promise<{ id: string }>;
}

const stepConfig = [
  {
    status: "PENDING_PAYMENT",
    label: "Menunggu Pembayaran",
    description: "Pesanan dibuat, menunggu konfirmasi pembayaran.",
    activeDescription: "Silakan selesaikan pembayaran agar pesanan dapat segera diproses.",
    completedDescription: "Pembayaran telah diterima.",
    Icon: Clock,
    color: "amber",
  },
  {
    status: "PROCESSING",
    label: "Diproses",
    description: "Pembayaran dikonfirmasi, pesanan sedang diproses.",
    activeDescription: "Pesanan sedang dikemas dan dipersiapkan untuk pengiriman.",
    completedDescription: "Pesanan selesai dikemas.",
    Icon: Package,
    color: "blue",
  },
  {
    status: "SHIPPED",
    label: "Dikirim",
    description: "Pesanan sudah dikirim ke alamat tujuan.",
    activeDescription: "Paket sedang dalam perjalanan menuju alamat Anda.",
    completedDescription: "Paket telah sampai di tujuan.",
    Icon: Truck,
    color: "indigo",
  },
  {
    status: "COMPLETED",
    label: "Selesai",
    description: "Pesanan telah diterima. Terima kasih!",
    activeDescription: "Pesanan telah selesai. Terima kasih sudah berbelanja!",
    completedDescription: "Pesanan selesai.",
    Icon: CheckCircle,
    color: "emerald",
  },
];

const statusMessages: Record<string, { title: string; subtitle: string; emoji: string }> = {
  PENDING_PAYMENT: {
    title: "Menunggu Pembayaran",
    subtitle: "Selesaikan pembayaran agar pesanan bisa segera diproses.",
    emoji: "⏳",
  },
  PROCESSING: {
    title: "Sedang Diproses",
    subtitle: "Pesanan Anda sedang dikemas dengan hati-hati.",
    emoji: "📦",
  },
  SHIPPED: {
    title: "Dalam Pengiriman",
    subtitle: "Paket sedang dalam perjalanan menuju alamat Anda!",
    emoji: "🚚",
  },
  COMPLETED: {
    title: "Pesanan Selesai",
    subtitle: "Pesanan telah diterima. Selamat membaca!",
    emoji: "✅",
  },
};

function getEstimatedDelivery(shippingMethodId: string | null, createdAt: Date): string | null {
  const option = getShippingOption(shippingMethodId);
  if (!option) return null;

  const created = new Date(createdAt);
  if (option.id === "anteraja-nextday") {
    const next = new Date(created);
    next.setDate(next.getDate() + 1);
    return formatDate(next);
  }
  if (option.id === "sicepat-best") {
    const from = new Date(created);
    from.setDate(from.getDate() + 1);
    const to = new Date(created);
    to.setDate(to.getDate() + 2);
    return `${formatDate(from)} - ${formatDate(to)}`;
  }
  // jne-reg
  const from = new Date(created);
  from.setDate(from.getDate() + 2);
  const to = new Date(created);
  to.setDate(to.getDate() + 4);
  return `${formatDate(from)} - ${formatDate(to)}`;
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const session = await requireAuth();
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: session.id,
    },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const orderPresentation = resolveOrderPresentation(order, session);
  const currentStepIndex = ORDER_STATUS_FLOW.indexOf(
    order.status as (typeof ORDER_STATUS_FLOW)[number]
  );
  const isCompleted = order.status === "COMPLETED";
  const progressPercentage =
    currentStepIndex < 0 ? 0 : (currentStepIndex / (stepConfig.length - 1)) * 100;
  const currentStatusMsg = statusMessages[order.status] ?? statusMessages.PENDING_PAYMENT;
  const estimatedDelivery = getEstimatedDelivery(order.shippingMethodId, order.createdAt);

  return (
    <div className="space-y-6">
      {/* Header with Status Banner */}
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-blue-100/80 blur-3xl" />

        <div className="relative">
          <Link
            href="/dashboard/orders"
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:border-primary/35 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Track Order
          </p>
          <h1 className="mt-2 text-[clamp(1.6rem,3.5vw,2.4rem)] font-black tracking-[-0.03em] text-slate-900">
            Lacak Pesanan
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {orderPresentation.orderNumber}
            </span>
            <span className="text-sm text-slate-500">
              Dibuat pada {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Current Status Banner */}
      <section
        className={`relative overflow-hidden rounded-[24px] border p-5 sm:p-6 ${
          isCompleted
            ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50"
            : order.status === "SHIPPED"
              ? "border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100/50"
              : order.status === "PROCESSING"
                ? "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50"
                : "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">{currentStatusMsg.emoji}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{currentStatusMsg.title}</h3>
            <p className="mt-0.5 text-sm text-slate-600">{currentStatusMsg.subtitle}</p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
              <span className="text-xs font-semibold text-slate-500">Progress</span>
              <span className="text-lg font-black text-primary">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        {estimatedDelivery && !isCompleted && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/60 bg-white/50 px-4 py-2.5">
            <Truck className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">
              Estimasi tiba: <span className="font-bold text-slate-900">{estimatedDelivery}</span>
            </span>
            {order.shippingMethodLabel && (
              <span className="ml-auto rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-200">
                {order.shippingMethodLabel}
              </span>
            )}
          </div>
        )}
      </section>

      {/* Progress Tracker */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Status Pesanan
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">Progress Pengiriman</h2>

        {/* Desktop Progress Bar */}
        <div className="mt-8 hidden md:block">
          {/* Steps */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-slate-200" />
            <div
              className="absolute left-0 top-6 h-1 rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="relative flex justify-between">
              {stepConfig.map((step, index) => {
                const isStepCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.Icon;
                const description = isStepCompleted
                  ? step.completedDescription
                  : isCurrent
                    ? step.activeDescription
                    : step.description;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center"
                    style={{ width: "25%" }}
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        isStepCompleted
                          ? "border-primary bg-primary text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
                          : isCurrent
                            ? "border-primary bg-white text-primary shadow-[0_8px_24px_-8px_rgba(37,99,235,0.35)] ring-4 ring-primary/15"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isStepCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    <p
                      className={`mt-3 text-center text-xs font-semibold uppercase tracking-[0.1em] ${
                        isStepCompleted || isCurrent ? "text-primary" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`mt-1 max-w-[140px] text-center text-[11px] leading-relaxed ${
                        isStepCompleted || isCurrent ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {description}
                    </p>

                    {isCurrent && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        Saat ini
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Progress (Vertical) */}
        <div className="mt-8 md:hidden">

          <div className="relative ml-6">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div
              className="absolute left-0 top-0 w-0.5 bg-primary transition-all duration-700 ease-out"
              style={{
                height: `${progressPercentage}%`,
              }}
            />

            <div className="space-y-8">
              {stepConfig.map((step, index) => {
                const isStepCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.Icon;
                const description = isStepCompleted
                  ? step.completedDescription
                  : isCurrent
                    ? step.activeDescription
                    : step.description;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 -ml-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        isStepCompleted
                          ? "border-primary bg-primary text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
                          : isCurrent
                            ? "border-primary bg-white text-primary shadow-[0_8px_24px_-8px_rgba(37,99,235,0.35)] ring-4 ring-primary/15"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isStepCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isStepCompleted || isCurrent ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                            Saat ini
                          </span>
                        )}
                        {isStepCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                            Selesai
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          isStepCompleted || isCurrent ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Order Items */}
      {order.items.length > 0 && (
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)] sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Barang Pesanan ({order.items.length} item)
              </p>
              <p className="text-xs text-slate-500">Daftar buku yang Anda pesan</p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-slate-200"
              >
                {/* Book Image */}
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {item.imageUrlSnapshot ? (
                    <Image
                      src={item.imageUrlSnapshot}
                      alt={item.productTitleSnapshot ?? "Book"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.productTitleSnapshot}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.authorSnapshot}
                    {item.categoryNameSnapshot && (
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {item.categoryNameSnapshot}
                      </span>
                    )}
                  </p>
                </div>

                {/* Qty & Price */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">
                    {formatRupiah(item.lineTotal)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {item.quantity} × {formatRupiah(item.unitPriceSnapshot)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shipping & Recipient Info */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Alamat Pengiriman</p>
              <p className="text-xs text-slate-500">Tujuan paket Anda</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {orderPresentation.recipientName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-700">{orderPresentation.phoneNumber}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
              {order.shippingAddress}
            </div>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ringkasan Biaya</p>
              <p className="text-xs text-slate-500">Breakdown total pembayaran</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(orderPresentation.subtotalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Ongkir</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(orderPresentation.shippingFeeAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Biaya layanan</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(orderPresentation.serviceFeeAmount)}
              </span>
            </div>
            <div className="mt-2 rounded-[20px] border border-primary/10 bg-primary-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-black tracking-[-0.03em] text-slate-900">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Detail Pesanan */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Detail Pesanan</p>
              <p className="text-xs text-slate-500">Info pengiriman & pembayaran</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pengiriman</span>
              <span className="font-semibold text-slate-900">
                {orderPresentation.shippingMethodLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pembayaran</span>
              <span className="font-semibold text-slate-900">
                {orderPresentation.paymentMethodLabel}
              </span>
            </div>
            {estimatedDelivery && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimasi tiba</span>
                <span className="font-semibold text-slate-900">{estimatedDelivery}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status pembayaran</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  orderPresentation.paymentStatus === "PAID"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : orderPresentation.paymentStatus === "COD_PENDING"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {orderPresentation.paymentStatus === "PAID"
                  ? "Lunas"
                  : orderPresentation.paymentStatus === "COD_PENDING"
                    ? "COD (Bayar di Tempat)"
                    : "Belum Bayar"}
              </span>
            </div>
          </div>
        </article>

        {/* Timeline */}
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Timeline
          </p>
          <h3 className="mt-1 text-sm font-bold text-slate-900">Riwayat Status</h3>

          <div className="mt-4 space-y-4">
            <div className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="w-0.5 flex-1 bg-slate-200" />
              </div>
              <div className="pb-4">
                <p className="text-xs font-semibold text-slate-900">Order dibuat</p>
                <p className="text-[11px] text-slate-500">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>

            {order.paidAt && (
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div className="w-0.5 flex-1 bg-slate-200" />
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-slate-900">Pembayaran dikonfirmasi</p>
                  <p className="text-[11px] text-slate-500">{formatDateTime(order.paidAt)}</p>
                </div>
              </div>
            )}

            {order.completedAt && (
              <div className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div className="w-0.5 flex-1 bg-transparent" />
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-slate-900">Pesanan selesai</p>
                  <p className="text-[11px] text-slate-500">
                    {formatDateTime(order.completedAt)}
                  </p>
                </div>
              </div>
            )}

            <div className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-2.5 w-2.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-slate-300 animate-pulse"}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Terakhir diperbarui</p>
                <p className="text-[11px] text-slate-500">{formatDateTime(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/orders/${order.id}/invoice`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
        >
          Lihat Invoice
        </Link>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
        >
          Kembali ke Riwayat Belanja
        </Link>
      </div>
    </div>
  );
}
