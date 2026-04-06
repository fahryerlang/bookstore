import prisma from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Users, ShoppingBag, FolderOpen, MessageSquare, TrendingUp, ArrowRight } from "@/components/icons";
import { formatRupiah } from "@/lib/utils";

export default async function AdminDashboard() {
  const [
    bookCount,
    userCount,
    orderCount,
    categoryCount,
    messageCount,
    recentOrders,
    totalRevenue,
    pendingOrderCount,
    processingOrderCount,
    shippedOrderCount,
    completedOrderCount,
  ] =
    await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count(),
      prisma.category.count(),
      prisma.message.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
    ]);

  const activeOrderCount = pendingOrderCount + processingOrderCount + shippedOrderCount;
  const completionRate =
    orderCount === 0 ? 0 : Math.round((completedOrderCount / orderCount) * 100);

  const stats = [
    {
      label: "Total Buku",
      value: bookCount,
      icon: BookOpen,
      gradient: "from-primary-100 to-primary-50",
      iconBg: "bg-primary-100",
      iconColor: "text-primary",
      href: "/admin/books",
      helper: "Produk siap jual",
    },
    {
      label: "Total Pengguna",
      value: userCount,
      icon: Users,
      gradient: "from-emerald-100 to-white",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      href: "/admin/users",
      helper: "Akun pelanggan",
    },
    {
      label: "Total Pesanan",
      value: orderCount,
      icon: ShoppingBag,
      gradient: "from-sky-100 to-white",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      href: "/admin/orders",
      helper: "Riwayat transaksi",
    },
    {
      label: "Kategori",
      value: categoryCount,
      icon: FolderOpen,
      gradient: "from-indigo-100 to-white",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      href: "/admin/categories",
      helper: "Segmentasi katalog",
    },
    {
      label: "Pesan Masuk",
      value: messageCount,
      icon: MessageSquare,
      gradient: "from-violet-100 to-white",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      href: "/admin/messages",
      helper: "Interaksi pelanggan",
    },
  ];

  const quickInsights = [
    {
      title: "Total Pendapatan",
      value: formatRupiah(totalRevenue._sum.totalAmount ?? 0),
      helper: "Akumulasi semua pesanan",
      icon: TrendingUp,
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      title: "Tingkat Selesai",
      value: `${completionRate}%`,
      helper: `${completedOrderCount} dari ${orderCount} pesanan`,
      icon: ShoppingBag,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pesanan Aktif",
      value: activeOrderCount,
      helper: "Menunggu, diproses, dan dikirim",
      icon: ArrowRight,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      title: "Pesan Pelanggan",
      value: messageCount,
      helper: "Masukan dan pertanyaan terbaru",
      icon: MessageSquare,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
    },
  ];

  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Menunggu Bayar",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    COMPLETED: "Selesai",
  };

  const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
    PENDING_PAYMENT: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
    PROCESSING: { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
    SHIPPED: { dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700" },
    COMPLETED: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_32px_85px_-58px_rgba(15,23,42,0.75)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.95rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
              Ringkasan Performa Toko
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Lihat kondisi bisnis dalam sekali pandang: inventori, operasional pesanan,
              dan kualitas interaksi pelanggan.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/admin/books"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
              >
                Kelola Buku
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Monitor Pesanan
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickInsights.map((insight) => {
              const Icon = insight.icon;

              return (
                <article
                  key={insight.title}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_44px_-42px_rgba(15,23,42,0.8)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {insight.title}
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">{insight.value}</p>
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${insight.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${insight.iconColor}`} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{insight.helper}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${stat.gradient} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_26px_52px_-38px_rgba(15,23,42,0.55)]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <p className="mb-1 text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium tracking-wide text-slate-500">{stat.label}</p>
              <p className="mt-1 text-[11px] text-slate-500">{stat.helper}</p>
            </Link>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-55px_rgba(15,23,42,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Pesanan Terbaru</h2>
            <p className="mt-0.5 text-xs text-slate-500">5 pesanan terakhir masuk</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Pending {pendingOrderCount}
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              Diproses {processingOrderCount}
            </span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
              Dikirim {shippedOrderCount}
            </span>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Lihat Semua
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">Belum ada pesanan.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => {
              const sc = statusConfig[order.status];
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      <ShoppingBag className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.user.name}</p>
                      <p className="text-xs text-slate-500">{order.user.email}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">
                        #{order.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
