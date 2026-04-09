import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { paymentStatusLabels, resolveOrderPresentation } from "@/lib/orders";
import { formatDate, formatRupiah } from "@/lib/utils";
import {
  ArrowRight,
  Banknote,
  CheckCircle,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "@/components/icons";
import Pagination from "@/components/Pagination";

const ORDERS_PER_PAGE = 5;

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

const statusTone: Record<string, string> = {
  PENDING_PAYMENT: "border border-amber-200 bg-amber-50 text-amber-700",
  PROCESSING: "border border-blue-200 bg-blue-50 text-blue-700",
  SHIPPED: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  COMPLETED: "border border-emerald-200 bg-emerald-50 text-emerald-700",
};

interface UserOrderHistoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UserOrderHistoryPage({ searchParams }: UserOrderHistoryPageProps) {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin/orders");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [orders, totalCount, allOrders, completedAmount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ORDERS_PER_PAGE,
      take: ORDERS_PER_PAGE,
    }),
    prisma.order.count({ where: { userId: session.id } }),
    prisma.order.findMany({
      where: { userId: session.id },
      select: { status: true },
    }),
    prisma.order.aggregate({
      where: { userId: session.id, status: "COMPLETED" },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ORDERS_PER_PAGE);

  function buildPageHref(p: number) {
    return p > 1 ? `/dashboard/orders?page=${p}` : "/dashboard/orders";
  }

  const activeOrderCount = allOrders.filter((order) =>
    ["PENDING_PAYMENT", "PROCESSING", "SHIPPED"].includes(order.status)
  ).length;
  const completedOrderCount = allOrders.filter((order) => order.status === "COMPLETED").length;
  const totalSpent = completedAmount._sum.totalAmount ?? 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-blue-100/80 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Purchase History
            </p>
            <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] font-black tracking-[-0.03em] text-slate-900">
              Riwayat Belanja Anda
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Semua pesanan Anda dikumpulkan di satu halaman agar mudah meninjau status, total belanja, dan detail checkout terakhir.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/books"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
              >
                Belanja Lagi
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Pesanan
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalCount}</p>
            </article>
            <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                Pesanan Aktif
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-900">{activeOrderCount}</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Total Belanja
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">{formatRupiah(totalSpent)}</p>
            </article>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <ShoppingBag className="h-7 w-7 text-slate-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">Belum ada riwayat belanja.</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Begitu Anda menyelesaikan checkout pertama, semua order akan tampil di halaman ini.
          </p>
          <Link
            href="/dashboard/books"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary"
          >
            Jelajah Buku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderPresentation = resolveOrderPresentation(order, session);

            return (
              <article
                key={order.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        {orderPresentation.orderNumber}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          statusTone[order.status] ?? "border border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                        {paymentStatusLabels[orderPresentation.paymentStatus]}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                      Pesanan untuk {orderPresentation.recipientName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Dibuat pada {formatDate(order.createdAt)} • {orderPresentation.phoneNumber}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-primary/10 bg-primary-50/80 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Total Pembayaran
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Alamat pengiriman</p>
                        <p className="text-xs text-slate-500">Snapshot checkout saat order dibuat</p>
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {orderPresentation.shippingAddress}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Pembayaran</p>
                          <p className="mt-1 text-sm text-slate-600">{orderPresentation.paymentMethodLabel}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Pengiriman</p>
                          <p className="mt-1 text-sm text-slate-600">{orderPresentation.shippingMethodLabel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Ringkasan biaya
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Subtotal buku</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(orderPresentation.subtotalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Ongkir</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(orderPresentation.shippingFeeAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Biaya layanan</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(orderPresentation.serviceFeeAmount)}</span>
                      </div>
                    </div>
                    <div className="mt-4 rounded-[20px] border border-primary/10 bg-primary-50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">Total</span>
                        <span className="text-lg font-black tracking-[-0.03em] text-slate-900">
                          {formatRupiah(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {orderPresentation.orderNotes ? (
                  <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Catatan pesanan</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {orderPresentation.orderNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/orders/${order.id}/invoice`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
                  >
                    Lihat Invoice
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/dashboard/orders/${order.id}/track`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-white"
                  >
                    Lacak Pesanan
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/checkout/success?order=${order.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    Lihat Ringkasan Order
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {order.status !== "COMPLETED" ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      <CheckCircle className="h-4 w-4" />
                      Status masih berjalan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                      <Banknote className="h-4 w-4" />
                      Sudah selesai diproses
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {orders.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Pending Review
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
              {allOrders.filter((order) => order.status === "PENDING_PAYMENT").length}
            </p>
            <p className="mt-2 text-sm text-slate-500">Pesanan yang masih menunggu pembayaran.</p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Sedang Dikirim
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
              {allOrders.filter((order) => order.status === "SHIPPED").length}
            </p>
            <p className="mt-2 text-sm text-slate-500">Order yang sudah masuk tahap distribusi.</p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Order Selesai
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
              {completedOrderCount}
            </p>
            <p className="mt-2 text-sm text-slate-500">Total transaksi yang sudah selesai diproses.</p>
          </article>
        </section>
      ) : null}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildPageHref} />
      )}
    </div>
  );
}