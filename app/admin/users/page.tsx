import prisma from "@/lib/prisma";
import { Users } from "@/components/icons";
import { formatDate } from "@/lib/utils";

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

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const buyerCount = users.length - adminCount;
  const activeBuyerCount = users.filter(
    (user) => user.role === "USER" && user._count.orders > 0
  ).length;
  const topBuyer = users
    .filter((user) => user.role === "USER")
    .sort((a, b) => b._count.orders - a._count.orders)[0];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Users Management
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.75rem)] font-black tracking-[-0.03em] text-slate-900">
              Daftar Pengguna
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Monitor pertumbuhan akun, aktivitas pembeli, dan komposisi role dalam
              sistem.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Pengguna
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{users.length}</p>
              <p className="mt-1 text-xs text-slate-500">Akun terdaftar</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Pembeli Aktif
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{activeBuyerCount}</p>
              <p className="mt-1 text-xs text-slate-500">User dengan pesanan</p>
            </article>
            <article className="rounded-2xl border border-primary/20 bg-primary-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Role Admin
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{adminCount}</p>
              <p className="mt-1 text-xs text-slate-600">Kontrol panel admin</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Top Buyer
              </p>
              <p className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
                {topBuyer?.name ?? "-"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {topBuyer ? `${topBuyer._count.orders} pesanan` : "Belum ada transaksi"}
              </p>
            </article>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
          <Users className="h-3.5 w-3.5 text-primary" />
          Komposisi akun: {buyerCount} user dan {adminCount} admin
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-medium text-slate-600">Belum ada pengguna terdaftar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-6 py-4">Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Peran</th>
                  <th className="px-6 py-4">Pesanan</th>
                  <th className="px-6 py-4">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 border ${
                          user.role === "ADMIN"
                            ? "bg-gradient-to-br from-primary-100 to-primary-50 border-primary/25"
                            : "bg-gradient-to-br from-slate-100 to-white border-slate-200"
                        }`}>
                          <span className={`text-xs font-bold ${
                            user.role === "ADMIN" ? "text-primary" : "text-slate-600"
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>
                        <p className="text-sm text-slate-700">{user.email}</p>
                        <p className="text-xs text-slate-500">ID #{user.id.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "border border-primary/20 bg-primary-50 text-primary"
                            : "border border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {user.role === "ADMIN" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          user._count.orders > 0
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user._count.orders > 0 ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {user._count.orders} pesanan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
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
