import prisma from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";

/**
 * Halaman manajemen pesanan (Admin).
 * Menampilkan semua pesanan dan memungkinkan perubahan status.
 */
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-indigo-600" />
          Manajemen Pesanan
        </h1>
        <p className="text-gray-500 mt-1">
          Pantau dan kelola status pesanan pelanggan.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Alamat</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 max-w-50 truncate">
                      {order.shippingAddress}
                    </td>
                    <td className="px-6 py-3">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        statusLabels={statusLabels}
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
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
