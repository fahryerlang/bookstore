import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "@/components/icons";
import Link from "next/link";
import CartSelectionPanel from "./CartSelectionPanel";

/**
 * Halaman keranjang belanja pengguna.
 * Menampilkan item-item yang dipilih dan total harga.
 */
export default async function CartPage() {
  const session = await requireAuth();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { book: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <section className="editorial-surface-dark relative overflow-hidden rounded-[32px] px-6 py-8 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl animate-drift-slow" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur-sm">
              Reading Cart
            </span>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.8rem)] font-black leading-[0.96] tracking-[-0.04em] text-white">
              Keranjang pilihanmu sudah siap untuk dirapikan.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Susun ulang bacaan favorit, centang hanya buku yang ingin dibayar,
              cek ketersediaan stok secara real-time, lalu lanjut ke checkout dengan
              ritme visual yang lebih bersih dan fokus.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-3xl font-black text-white">{cartItems.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Judul Tersimpan
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-3xl font-black text-white">{totalQuantity}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Total Unit
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-xl font-black text-white sm:text-2xl">
                  {formatRupiah(totalAmount)}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Nilai Keranjang
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/books"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 transition hover:bg-blue-50"
              >
                Tambah Buku Lagi
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Kurasi tetap rapi</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Setiap item tampil lebih fokus agar kamu cepat memutuskan buku mana
                yang siap dibawa ke tahap berikutnya.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <Truck className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Flow lebih ringan</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Keranjang, alamat, dan konfirmasi dibagi jelas supaya checkout terasa
                cepat tanpa kehilangan konteks.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Stok tervalidasi</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Jumlah buku yang kamu pilih tetap diverifikasi ketika pesanan akan
                diproses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="editorial-surface rounded-[28px] px-6 py-16 text-center sm:px-8">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-50 text-primary shadow-[0_24px_60px_-42px_rgba(37,99,235,0.7)]">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Rak keranjangmu masih kosong.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Jelajahi katalog, pilih judul yang paling relevan, lalu kembali ke sini
            untuk checkout dengan tampilan yang lebih imersif.
          </p>
          <Link
            href="/dashboard/books"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary"
          >
            Jelajahi Buku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <CartSelectionPanel
          key={cartItems.map((item) => item.id).join(":")}
          items={cartItems.map((item) => ({
            id: item.id,
            title: item.book.title,
            price: item.book.price,
            imageUrl: item.book.imageUrl,
            quantity: item.quantity,
            stock: item.book.stock,
            categoryName: item.book.category.name,
          }))}
        />
      )}
    </div>
  );
}
