import prisma from "@/lib/prisma";
import { BookOpen, Users, ShoppingBag, FolderOpen, MessageSquare, TrendingUp } from "lucide-react";

/**
 * Halaman dashboard utama admin yang menampilkan statistik ringkas.
 */
export default async function AdminDashboard() {
  const [bookCount, userCount, orderCount, categoryCount, messageCount, recentOrders] =
    await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count(),
      prisma.category.count(),
      prisma.message.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
    ]);

  const stats = [
    { label: "Total Buku", value: bookCount, icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Pengguna", value: userCount, icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Pesanan", value: orderCount, icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
    { label: "Kategori", value: categoryCount, icon: FolderOpen, color: "bg-purple-50 text-purple-600" },
    { label: "Pesan Masuk", value: messageCount, icon: MessageSquare, color: "bg-pink-50 text-pink-600" },
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          Dashboard Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Ringkasan data toko buku Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">ID Pesanan</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
