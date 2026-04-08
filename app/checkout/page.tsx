import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatDate, formatRupiah } from "@/lib/utils";
import {
  getPaymentOption,
  getShippingOption,
  paymentOptions,
  shippingOptions,
} from "@/lib/checkout";
import { parseStoredCheckoutSnapshot } from "@/lib/orders";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CreditCard,
  ShieldCheck,
  Truck,
} from "@/components/icons";
import CheckoutForm from "./CheckoutForm";

interface CheckoutPageProps {
  searchParams: Promise<{ items?: string | string[] }>;
}

function parseSelectedCartItemIds(itemsParam: string | string[] | undefined) {
  const rawValues = Array.isArray(itemsParam) ? itemsParam : itemsParam ? [itemsParam] : [];

  return Array.from(
    new Set(
      rawValues
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

/**
 * Halaman checkout untuk menyelesaikan pesanan.
 * Menampilkan ringkasan belanjaan dan formulir alamat pengiriman.
 */
export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await requireAuth();
  const { items } = await searchParams;
  const selectedCartItemIds = parseSelectedCartItemIds(items);
  const hasExplicitSelection = selectedCartItemIds.length > 0;

  const [cartItems, latestOrder] = await Promise.all([
    prisma.cartItem.findMany({
      where: {
        userId: session.id,
        ...(hasExplicitSelection ? { id: { in: selectedCartItemIds } } : {}),
      },
      include: {
        book: {
          include: {
            category: true,
          },
        },
      },
    }),
    prisma.order.findFirst({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        shippingAddress: true,
        rawCheckoutSnapshot: true,
      },
    }),
  ]);

  if (cartItems.length === 0) redirect("/cart");

  const latestCheckout = parseStoredCheckoutSnapshot(
    latestOrder?.rawCheckoutSnapshot,
    latestOrder?.shippingAddress
  );
  const latestShipping = getShippingOption(latestCheckout?.shippingService);
  const latestPayment = getPaymentOption(latestCheckout?.paymentMethod);
  const defaultCheckout = latestCheckout && latestOrder
    ? {
        recipientName: latestCheckout.recipientName,
        contactEmail: latestCheckout.contactEmail,
        phoneNumber: latestCheckout.phoneNumber,
        address: latestCheckout.address,
        orderNotes: latestCheckout.orderNotes,
        shippingService: latestCheckout.shippingService,
        paymentMethod: latestCheckout.paymentMethod,
        shippingLabel: latestShipping?.label ?? "Kurir terakhir",
        paymentLabel: latestPayment?.label ?? "Pembayaran terakhir",
        updatedAt: formatDate(latestOrder.createdAt),
      }
    : null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const actualSelectedCartItemIds = cartItems.map((item) => item.id);
  const checkoutItems = cartItems.map((item) => ({
    id: item.id,
    title: item.book.title,
    price: item.book.price,
    quantity: item.quantity,
    imageUrl: item.book.imageUrl,
    categoryName: item.book.category?.name ?? "Buku Pilihan",
  }));

  return (
    <div className="space-y-6">
      <section className="editorial-surface relative overflow-hidden rounded-[32px] px-6 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-primary/12 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -right-14 bottom-0 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl animate-drift-slow" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <span className="editorial-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase">
              Checkout Studio
            </span>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-black leading-[0.98] tracking-[-0.04em] text-slate-900">
              Satu langkah lagi menuju rak bacaan baru.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Lengkapi checkout seperti toko online modern: pilih penerima, kurir,
              metode pembayaran, catatan pengiriman, lalu cek total akhirnya secara
              live sebelum konfirmasi.
              {defaultCheckout
                ? " Data checkout terakhir juga sudah kami siapkan sebagai isian awal agar proses lebih singkat."
                : ""}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                {shippingOptions.length} opsi kurir
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                {paymentOptions.length} metode bayar
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                Total dihitung live
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                {hasExplicitSelection ? `${cartItems.length} judul dipilih` : "Semua item keranjang"}
              </span>
              {defaultCheckout ? (
                <span className="rounded-full border border-primary/15 bg-primary-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Default checkout aktif
                </span>
              ) : null}
            </div>

            <Link
              href="/cart"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Tinjau Keranjang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="editorial-surface-dark rounded-[28px] p-5 text-white">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100">
              <CreditCard className="h-4 w-4" />
              Live Checkout
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-black">{cartItems.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Judul Dipilih
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-black">{totalQuantity}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Unit
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[1.7rem] font-black tracking-[-0.04em]">
                  {formatRupiah(totalAmount)}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Subtotal Buku
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {defaultCheckout ? (
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Default Checkout
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {defaultCheckout.shippingLabel} • {defaultCheckout.paymentLabel}
                  </p>
                  <p className="mt-2 text-slate-200">
                    Terakhir dipakai {defaultCheckout.updatedAt}. Form penerima akan terisi otomatis dan tetap bisa disesuaikan.
                  </p>
                </div>
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-slate-200">
                  Ongkir dan biaya layanan dihitung setelah kurir dan pembayaran dipilih.
                </div>
              )}
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-slate-200">
                Status awal pesanan menyesuaikan metode pembayaran yang dipilih pelanggan.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="editorial-surface rounded-[24px] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
            <Truck className="h-4 w-4" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">Kurir bisa dipilih</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Pelanggan dapat memilih layanan pengiriman sesuai kecepatan dan biaya yang diinginkan.
          </p>
        </div>

        <div className="editorial-surface rounded-[24px] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
            <Banknote className="h-4 w-4" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">Metode pembayaran beragam</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Checkout kini mendukung transfer, QRIS, kartu, dan COD dengan biaya layanan yang berbeda.
          </p>
        </div>

        <div className="editorial-surface rounded-[24px] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">Konfirmasi lebih realistis</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Ringkasan total menampilkan subtotal buku, ongkir, biaya layanan, dan grand total seperti toko online modern.
          </p>
        </div>
      </section>

      <CheckoutForm
        userName={session.name}
        userEmail={session.email}
        cartItems={checkoutItems}
        subtotalAmount={totalAmount}
        defaultCheckout={defaultCheckout}
        selectedCartItemIds={actualSelectedCartItemIds}
      />
    </div>
  );
}
