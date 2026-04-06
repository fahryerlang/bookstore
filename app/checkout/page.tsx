import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatRupiah } from "@/lib/utils";
import { redirect } from "next/navigation";
import { CreditCard } from "@/components/icons";
import CheckoutForm from "./CheckoutForm";

/**
 * Halaman checkout untuk menyelesaikan pesanan.
 * Menampilkan ringkasan belanjaan dan formulir alamat pengiriman.
 */
export default async function CheckoutPage() {
  const session = await requireAuth();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { book: true },
  });

  if (cartItems.length === 0) redirect("/cart");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <CreditCard className="h-6 w-6 text-indigo-600" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {item.book.title} × {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    {formatRupiah(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="md:col-span-2 order-1 md:order-2">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
