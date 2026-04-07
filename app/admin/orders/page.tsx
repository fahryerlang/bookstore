import prisma from "@/lib/prisma";
import { getPaymentOption, getShippingOption, parseCheckoutSnapshot } from "@/lib/checkout";
import { ShoppingBag, TrendingUp } from "@/components/icons";
import { formatRupiah, formatDate } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Menunggu Pembayaran",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    COMPLETED: "Selesai",
  };

  const statusCount = orders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {
      PENDING_PAYMENT: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      COMPLETED: 0,
    }
  );

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const completionRate =
    orders.length > 0
      ? Math.round((statusCount.COMPLETED / orders.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Orders Management
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.75rem)] font-black tracking-[-0.03em] text-slate-900">
              Manajemen Pesanan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Pantau arus transaksi dan ubah status pesanan langsung dari satu panel
              operasional yang responsif.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Pesanan
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length}</p>
              <p className="mt-1 text-xs text-slate-500">Transaksi tercatat</p>
            </article>
            <article className="rounded-2xl border border-primary/20 bg-primary-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Pendapatan Kotor
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatRupiah(totalRevenue)}</p>
              <p className="mt-1 text-xs text-slate-600">Dari semua pesanan</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Tingkat Selesai
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">{completionRate}%</p>
              <p className="mt-1 text-xs text-emerald-700">Pesanan selesai diproses</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Nilai Rata-rata
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatRupiah(averageOrderValue)}</p>
              <p className="mt-1 text-xs text-slate-500">Per pesanan</p>
            </article>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            Pending {statusCount.PENDING_PAYMENT}
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Diproses {statusCount.PROCESSING}
          </span>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
            Dikirim {statusCount.SHIPPED}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Selesai {statusCount.COMPLETED}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-900">
            <TrendingUp className="h-3 w-3" />
            Workflow aktif
          </span>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <ShoppingBag className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-medium text-slate-600">Belum ada pesanan</p>
            <p className="mt-1 text-sm text-slate-500">Pesanan akan muncul di sini setelah pelanggan checkout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Fulfillment</th>
                    <th className="px-6 py-4">Pembayaran</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Alamat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const checkoutSnapshot = parseCheckoutSnapshot(order.shippingAddress);
                  const shippingOption = getShippingOption(checkoutSnapshot?.shippingService);
                  const paymentOption = getPaymentOption(checkoutSnapshot?.paymentMethod);
                  const recipientName = checkoutSnapshot?.recipientName || order.user.name;
                  const phoneNumber = checkoutSnapshot?.phoneNumber || "Nomor belum tercatat";
                  const shippingService = shippingOption?.label || checkoutSnapshot?.shippingService || "Kurir lama";
                  const paymentMethod = paymentOption?.label || checkoutSnapshot?.paymentMethod || "Metode lama";
                  const subtotalAmount = checkoutSnapshot?.subtotalAmount || order.totalAmount;
                  const shippingFee = checkoutSnapshot?.shippingFee || 0;
                  const serviceFee = checkoutSnapshot?.serviceFee || 0;
                  const formattedAddress = checkoutSnapshot?.address || order.shippingAddress;
                  const orderNotes = checkoutSnapshot?.orderNotes;

                  return (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary-50">
                          <span className="text-xs font-bold text-primary">{order.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{order.user.name}</p>
                          <p className="text-xs text-slate-500">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {recipientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {phoneNumber}
                      </p>
                      <p className="mt-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700">
                        {shippingService}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {paymentMethod}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Subtotal {formatRupiah(subtotalAmount)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ongkir {formatRupiah(shippingFee)} • Layanan {formatRupiah(serviceFee)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="max-w-[260px] px-6 py-4 text-sm text-slate-600">
                      <p className="line-clamp-2 leading-relaxed">{formattedAddress}</p>
                      {orderNotes ? (
                        <p className="mt-2 text-xs text-slate-400">Catatan: {orderNotes}</p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        statusLabels={statusLabels}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
