import ExpenseForm from "./ExpenseForm";
import DeleteExpenseButton from "./DeleteExpenseButton";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolvePaymentStatus } from "@/lib/orders";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Banknote, FolderOpen, Package, ShoppingBag, TrendingUp } from "@/components/icons";

interface AdminReportsPageProps {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function parseDateInput(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolvePeriod(range?: string, from?: string, to?: string) {
  const now = new Date();
  const customStart = parseDateInput(from);
  const customEnd = parseDateInput(to);
  const end = endOfDay(customEnd ?? now);

  if (range === "custom" && customStart) {
    return {
      start: startOfDay(customStart),
      end,
      label: `${formatDate(customStart)} - ${formatDate(end)}`,
      range: "custom",
    };
  }

  const days = Number(range ?? "30");
  const safeDays = Number.isFinite(days) && days > 0 ? days : 30;
  const start = startOfDay(new Date(end));
  start.setDate(start.getDate() - (safeDays - 1));

  return {
    start,
    end,
    label: `${safeDays} hari terakhir`,
    range: String(safeDays),
  };
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  await requireAdmin();
  const { range, from, to } = await searchParams;
  const period = resolvePeriod(range, from, to);

  const [salesOrders, paidOrders, expenses] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: period.start,
          lte: period.end,
        },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: {
        paidAt: {
          gte: period.start,
          lte: period.end,
        },
      },
      include: {
        items: true,
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.expense.findMany({
      where: {
        paidAt: {
          gte: period.start,
          lte: period.end,
        },
      },
      include: {
        expenseCategory: true,
      },
      orderBy: { paidAt: "desc" },
    }),
  ]);

  const detailedSalesOrders = salesOrders.filter(
    (order) => order.dataCompleteness === "FULL" && order.items.length > 0
  );
  const salesCoverage =
    salesOrders.length > 0
      ? Math.round((detailedSalesOrders.length / salesOrders.length) * 100)
      : 100;
  const paidRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const grossBookSales = paidOrders.reduce((sum, order) => sum + order.subtotalAmount, 0);
  const shippingCollected = paidOrders.reduce((sum, order) => sum + order.shippingFeeAmount, 0);
  const serviceCollected = paidOrders.reduce((sum, order) => sum + order.serviceFeeAmount, 0);
  const outstandingAmount = salesOrders.reduce((sum, order) => {
    return resolvePaymentStatus(order.paymentStatus, order.status) !== "PAID"
      ? sum + order.totalAmount
      : sum;
  }, 0);
  const estimatedCogs = paidOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + item.unitCostSnapshot * item.quantity,
        0
      )
    );
  }, 0);
  const operatingExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const estimatedGrossProfit = paidRevenue - estimatedCogs;
  const estimatedNetProfit = estimatedGrossProfit - operatingExpenses;
  const totalUnitsSold = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const averageOrderValue = paidOrders.length > 0 ? Math.round(paidRevenue / paidOrders.length) : 0;

  const productMap = new Map<
    string,
    { title: string; quantity: number; revenue: number; cost: number }
  >();
  const categoryMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  const paymentMap = new Map<string, { label: string; count: number; revenue: number }>();
  const expenseMap = new Map<string, { name: string; amount: number }>();

  for (const order of paidOrders) {
    const paymentLabel = order.paymentMethodLabel ?? "Legacy / belum lengkap";
    const paymentEntry = paymentMap.get(paymentLabel) ?? {
      label: paymentLabel,
      count: 0,
      revenue: 0,
    };
    paymentEntry.count += 1;
    paymentEntry.revenue += order.totalAmount;
    paymentMap.set(paymentLabel, paymentEntry);

    for (const item of order.items) {
      const productEntry = productMap.get(item.productTitleSnapshot) ?? {
        title: item.productTitleSnapshot,
        quantity: 0,
        revenue: 0,
        cost: 0,
      };
      productEntry.quantity += item.quantity;
      productEntry.revenue += item.lineTotal;
      productEntry.cost += item.unitCostSnapshot * item.quantity;
      productMap.set(item.productTitleSnapshot, productEntry);

      const categoryName = item.categoryNameSnapshot ?? "Tanpa snapshot kategori";
      const categoryEntry = categoryMap.get(categoryName) ?? {
        name: categoryName,
        quantity: 0,
        revenue: 0,
      };
      categoryEntry.quantity += item.quantity;
      categoryEntry.revenue += item.lineTotal;
      categoryMap.set(categoryName, categoryEntry);
    }
  }

  for (const expense of expenses) {
    const entry = expenseMap.get(expense.expenseCategory.name) ?? {
      name: expense.expenseCategory.name,
      amount: 0,
    };
    entry.amount += expense.amount;
    expenseMap.set(expense.expenseCategory.name, entry);
  }

  const topProducts = Array.from(productMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 6);
  const topCategories = Array.from(categoryMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 6);
  const paymentBreakdown = Array.from(paymentMap.values()).sort(
    (left, right) => right.revenue - left.revenue
  );
  const expenseBreakdown = Array.from(expenseMap.values()).sort(
    (left, right) => right.amount - left.amount
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Sales & Finance
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.03em] text-slate-900">
              Laporan Penjualan dan Keuangan
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Halaman ini memisahkan penjualan, kas masuk, dan biaya operasional agar owner/admin tidak lagi membaca omzet mentah sebagai laba bersih.
            </p>
          </div>

          <form className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[160px_160px_160px_auto]">
            <select
              name="range"
              defaultValue={period.range}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            >
              <option value="7">7 hari</option>
              <option value="30">30 hari</option>
              <option value="90">90 hari</option>
              <option value="365">365 hari</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="date"
              name="from"
              defaultValue={from ?? ""}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            />
            <input
              type="date"
              name="to"
              defaultValue={to ?? ""}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Terapkan
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900">
            Periode {period.label}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Cakupan data detail {salesCoverage}%
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            {paidOrders.length} order lunas
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Gross Book Sales</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(grossBookSales)}</p>
          <p className="mt-2 text-sm text-slate-500">Subtotal item dari order yang sudah lunas.</p>
        </article>
        <article className="rounded-[24px] border border-primary/20 bg-primary-50 p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.45)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Cash In Terkonfirmasi</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(paidRevenue)}</p>
          <p className="mt-2 text-sm text-slate-600">Termasuk ongkir dan biaya layanan yang diterima di periode ini.</p>
        </article>
        <article className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.45)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Estimasi Laba Bersih</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-emerald-900">{formatRupiah(estimatedNetProfit)}</p>
          <p className="mt-2 text-sm text-emerald-800/80">Kas masuk dikurangi HPP snapshot dan expense operasional yang tercatat.</p>
        </article>
        <article className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.45)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">Outstanding</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-amber-900">{formatRupiah(outstandingAmount)}</p>
          <p className="mt-2 text-sm text-amber-800/80">Order yang belum dianggap lunas pada periode penjualan terpilih.</p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Order dibuat</p>
              <p className="text-xs text-slate-500">Basis penjualan</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-900">{salesOrders.length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Unit terjual</p>
              <p className="text-xs text-slate-500">Order lunas</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-900">{totalUnitsSold}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">AOV</p>
              <p className="text-xs text-slate-500">Order lunas</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(averageOrderValue)}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Expense</p>
              <p className="text-xs text-slate-500">Cash out</p>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(operatingExpenses)}</p>
        </article>
      </section>

      <section className="rounded-[26px] border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 shadow-[0_24px_65px_-52px_rgba(120,53,15,0.28)]">
        Laporan keuangan ini masih berstatus MVP. Angka laba saat ini belum mengurangi biaya gateway aktual atau biaya kirim riil merchant bila data tersebut belum dicatat. HPP dihitung dari snapshot harga modal buku saat order dibuat, sedangkan order legacy tanpa item detail akan menurunkan coverage laporan penjualan detail.
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Top Produk</p>
                  <p className="text-xs text-slate-500">Berdasarkan revenue order lunas</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada produk terjual di periode ini.</p>
                ) : (
                  topProducts.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.quantity} unit • HPP {formatRupiah(item.cost)}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(item.revenue)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Top Kategori</p>
                  <p className="text-xs text-slate-500">Snapshot kategori saat transaksi</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {topCategories.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada kategori terjual di periode ini.</p>
                ) : (
                  topCategories.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.quantity} unit terjual</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(item.revenue)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
              <p className="text-sm font-semibold text-slate-900">Metode Pembayaran</p>
              <p className="mt-1 text-xs text-slate-500">Pembagian revenue order lunas per metode pembayaran.</p>
              <div className="mt-4 space-y-3">
                {paymentBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada pembayaran lunas pada periode ini.</p>
                ) : (
                  paymentBreakdown.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.count} order</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(item.revenue)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
              <p className="text-sm font-semibold text-slate-900">Breakdown Expense</p>
              <p className="mt-1 text-xs text-slate-500">Akumulasi pengeluaran operasional per kategori.</p>
              <div className="mt-4 space-y-3">
                {expenseBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada expense dicatat di periode ini.</p>
                ) : (
                  expenseBreakdown.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(item.amount)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </section>

        <aside className="space-y-6">
          <ExpenseForm />

          <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
            <p className="text-sm font-semibold text-slate-900">Expense terbaru</p>
            <p className="mt-1 text-xs text-slate-500">Pengeluaran yang paling baru dicatat di periode aktif.</p>
            <div className="mt-4 space-y-3">
              {expenses.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada expense pada periode ini.</p>
              ) : (
                expenses.slice(0, 6).map((expense) => (
                  <div key={expense.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{expense.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {expense.expenseCategory.name} • {formatDate(expense.paidAt)}
                        </p>
                        {expense.notes ? (
                          <p className="mt-2 text-xs leading-relaxed text-slate-500">{expense.notes}</p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(expense.amount)}</p>
                        <div className="mt-2 flex justify-end">
                          <DeleteExpenseButton id={expense.id} title={expense.title} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </aside>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Biaya dikumpulkan</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(shippingCollected)}</p>
          <p className="mt-2 text-sm text-slate-500">Ongkir yang tertagih dari customer pada order lunas.</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Layanan terkumpul</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(serviceCollected)}</p>
          <p className="mt-2 text-sm text-slate-500">Biaya layanan yang ikut tertagih pada order lunas.</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Estimasi HPP</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">{formatRupiah(estimatedCogs)}</p>
          <p className="mt-2 text-sm text-slate-500">Akumulasi biaya modal buku dari snapshot order item yang sudah lunas.</p>
        </article>
      </section>
    </div>
  );
}