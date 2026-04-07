import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatDate, formatRupiah } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  CircleCheck,
  Clock3,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingCart,
  Sparkles,
} from "@/components/icons";

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
    featuredBooks,
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
    prisma.book.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  const completedSpend = completedOrderAmount._sum.totalAmount ?? 0;
  const maxCountStat = Math.max(
    cartItemCount,
    totalOrderCount,
    activeOrderCount,
    completedOrderCount,
    1
  );
  const completionPercent =
    totalOrderCount > 0 ? Math.round((completedOrderCount / totalOrderCount) * 100) : 0;
  const activePercent =
    totalOrderCount > 0 ? Math.round((activeOrderCount / totalOrderCount) * 100) : 0;
  const spendingMilestone = Math.max(
    500000,
    Math.ceil((completedSpend || 1) / 500000) * 500000
  );
  const spendingPercent = Math.round((completedSpend / spendingMilestone) * 100);

  const stats = [
    {
      label: "Item Keranjang",
      value: cartItemCount,
      icon: ShoppingCart,
      tone: "from-primary/16 to-primary/5 text-primary",
      progress: Math.round((cartItemCount / maxCountStat) * 100),
      progressLabel: `${cartItemCount} item siap checkout`,
    },
    {
      label: "Total Pesanan",
      value: totalOrderCount,
      icon: LayoutDashboard,
      tone: "from-blue-500/15 to-blue-500/5 text-blue-700",
      progress: Math.round((totalOrderCount / maxCountStat) * 100),
      progressLabel: `${totalOrderCount} transaksi tercatat`,
    },
    {
      label: "Pesanan Aktif",
      value: activeOrderCount,
      icon: Clock3,
      tone: "from-amber-500/20 to-amber-500/5 text-amber-700",
      progress: activePercent,
      progressLabel: `${activePercent}% dari total pesanan`,
    },
    {
      label: "Pesanan Selesai",
      value: completedOrderCount,
      icon: CircleCheck,
      tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
      progress: completionPercent,
      progressLabel: `${completionPercent}% pesanan selesai`,
    },
    {
      label: "Total Belanja",
      value: formatRupiah(completedSpend),
      icon: Banknote,
      tone: "from-primary/18 to-blue-500/5 text-primary",
      progress: spendingPercent,
      progressLabel: `${spendingPercent}% menuju ${formatRupiah(spendingMilestone)}`,
    },
  ];

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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_32px_90px_-62px_rgba(15,23,42,0.75)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              User Control Center
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] font-black tracking-[-0.03em] text-slate-900">
              Halo, {session.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Pantau keranjang, status pesanan, dan rekomendasi buku terbaru dalam satu panel yang
              lebih fokus dan nyaman dipakai harian.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary-50/85 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-900">
              Aktivitas Terbaru
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {latestOrders.length} pesanan ada di timeline Anda
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Jelajah Buku
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
          >
            Kelola Keranjang
          </Link>

          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
          >
            Profil Saya
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const progressWidth =
            stat.progress <= 0 ? "0%" : `${Math.min(Math.max(stat.progress, 8), 100)}%`;

          return (
            <article
              key={stat.label}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_52px_-44px_rgba(15,23,42,0.75)]"
            >
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-lg font-bold leading-tight text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-primary to-blue-500"
                    style={{ width: progressWidth }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 py-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  {stat.progressLabel}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <article
          id="pesanan-terakhir"
          className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Riwayat Pesanan Terakhir</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ringkasan status paling baru tanpa perlu membuka halaman terpisah.
              </p>
            </div>

            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
            >
              Lanjut Checkout
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {latestOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400">
                <Package className="h-6 w-6" />
              </div>
              <p className="mt-4 font-medium text-slate-700">Belum ada pesanan.</p>
              <p className="mt-1 text-sm text-slate-500">
                Mulai dari katalog buku untuk membuat transaksi pertama Anda.
              </p>
              <Link
                href="/dashboard/books"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
              >
                Buka Katalog
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {latestOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-primary/25 hover:bg-primary-50/35"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">#{order.id.slice(0, 8)}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>

                    <p className="text-base font-bold text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        statusTone[order.status] ?? "border border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>

                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Update live
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <h2 className="text-lg font-semibold text-slate-900">Aksi Cepat</h2>
          <p className="mt-1 text-sm text-slate-500">
            Jalur cepat untuk aktivitas yang paling sering Anda lakukan.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/cart"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-primary/35 hover:bg-white"
            >
              <span className="text-sm font-semibold text-slate-800">Kelola Keranjang</span>
              <ShoppingCart className="h-4 w-4 text-slate-400 transition group-hover:text-primary" />
            </Link>

            <Link
              href="/contact"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-primary/35 hover:bg-white"
            >
              <span className="text-sm font-semibold text-slate-800">Hubungi Admin</span>
              <MessageSquare className="h-4 w-4 text-slate-400 transition group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-primary/35 hover:bg-white"
            >
              <span className="text-sm font-semibold text-slate-800">Lihat Profil</span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-primary" />
            </Link>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Buku Untuk Kamu</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilihan judul baru dalam tampilan flex card, bukan tabel.
            </p>
          </div>

          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
          >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featuredBooks.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Belum ada buku tersedia.</div>
        ) : (
          <div className="flex flex-wrap gap-4 p-6">
            {featuredBooks.map((book) => (
              <article
                key={book.id}
                className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-44px_rgba(15,23,42,0.65)] transition duration-200 hover:-translate-y-1 hover:border-primary/30 sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.75rem)]"
              >
                <div className="relative aspect-[5/4] overflow-hidden border-b border-slate-200 bg-slate-100">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-900">
                    {book.category.name}
                  </span>

                  <h3 className="mt-3 line-clamp-2 text-base font-bold leading-tight text-slate-900">
                    {book.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {book.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{formatRupiah(book.price)}</p>
                      <p
                        className={`text-xs font-semibold ${
                          book.stock > 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {book.stock > 0 ? `Stok ${book.stock} unit` : "Stok habis"}
                      </p>
                    </div>

                    <Link
                      href={`/books/${book.id}`}
                      className="rounded-lg border border-primary/30 bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-900 transition hover:bg-primary-100"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
