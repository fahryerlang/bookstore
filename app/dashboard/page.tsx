import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatDate, formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  CircleCheck,
  Clock3,
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";

/**
 * Dashboard utama untuk pengguna pembeli.
 */
export default async function UserDashboardPage() {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const [
    cartItemCount,
    totalOrderCount,
    activeOrderCount,
    completedOrderCount,
    completedOrderAmount,
    latestOrders,
  ] = await Promise.all([
    prisma.cartItem.count({ where: { userId: session.id } }),
    prisma.order.count({ where: { userId: session.id } }),
    prisma.order.count({
      where: {
        userId: session.id,
        status: { in: ["PENDING_PAYMENT", "PROCESSING", "SHIPPED"] },
      },
    }),
    prisma.order.count({
      where: { userId: session.id, status: "COMPLETED" },
    }),
    prisma.order.aggregate({
      where: { userId: session.id, status: "COMPLETED" },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { userId: session.id },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    {
      label: "Item Keranjang",
      value: cartItemCount,
      icon: ShoppingCart,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Pesanan",
      value: totalOrderCount,
      icon: LayoutDashboard,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Pesanan Aktif",
      value: activeOrderCount,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Pesanan Selesai",
      value: completedOrderCount,
      icon: CircleCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Belanja",
      value: formatRupiah(completedOrderAmount._sum.totalAmount ?? 0),
      icon: Banknote,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Menunggu Pembayaran",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    COMPLETED: "Selesai",
  };

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Pembeli</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang, {session.name}. Pantau keranjang dan progres pesanan Anda di sini.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/#katalog"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900">Lanjut Belanja</p>
          <p className="text-sm text-gray-600 mt-1">Jelajahi katalog buku terbaru.</p>
          <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium mt-4">
            Buka katalog
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/cart"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900">Kelola Keranjang</p>
          <p className="text-sm text-gray-600 mt-1">Cek item, ubah jumlah, dan lanjut checkout.</p>
          <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium mt-4">
            Buka keranjang
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/checkout"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900">Lanjut Pembayaran</p>
          <p className="text-sm text-gray-600 mt-1">Selesaikan pesanan yang sudah siap.</p>
          <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium mt-4">
            Buka checkout
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/contact"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900">Hubungi Admin</p>
          <p className="text-sm text-gray-600 mt-1">Butuh bantuan? Kirim pesan dengan cepat.</p>
          <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium mt-4">
            Buka kontak
            <MessageSquare className="h-4 w-4" />
          </span>
        </Link>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Pesanan Terakhir</h2>
        </div>

        {latestOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Belum ada pesanan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">ID Pesanan</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-mono">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
