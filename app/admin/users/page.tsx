import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * Halaman daftar pengguna terdaftar (Admin).
 */
export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600" />
          Daftar Pengguna
        </h1>
        <p className="text-gray-500 mt-1">
          Semua pengguna terdaftar di sistem.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada pengguna terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Peran</th>
                  <th className="px-6 py-3">Pesanan</th>
                  <th className="px-6 py-3">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {user._count.orders}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
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
