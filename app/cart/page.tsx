import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, ArrowRight } from "@/components/icons";
import Link from "next/link";
import CartItemRow from "./CartItemRow";

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6 text-indigo-600" />
        Keranjang Belanja
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            Keranjang masih kosong
          </h3>
          <p className="text-gray-500 mt-1 mb-6">
            Mulai belanja buku favoritmu sekarang.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Jelajahi Buku
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                id={item.id}
                title={item.book.title}
                price={item.book.price}
                imageUrl={item.book.imageUrl}
                quantity={item.quantity}
                stock={item.book.stock}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">
                Total ({cartItems.length} item)
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatRupiah(totalAmount)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
