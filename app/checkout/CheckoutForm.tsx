"use client";

import { useActionState } from "react";
import { createOrder } from "@/lib/actions/orders";
import { Loader2, MapPin } from "lucide-react";

/**
 * Formulir checkout untuk memasukkan alamat pengiriman.
 */
export default function CheckoutForm() {
  const [state, formAction, isPending] = useActionState(createOrder, {
    success: false,
    message: "",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Alamat Pengiriman
        </h2>
      </div>

      <form action={formAction} className="space-y-5">
        {state.message && !state.success && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.message}
          </div>
        )}

        <div>
          <label
            htmlFor="shippingAddress"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Alamat Lengkap
          </label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            rows={4}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-gray-900"
            placeholder="Masukkan alamat lengkap termasuk kode pos..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
          {isPending ? "Memproses Pesanan..." : "Konfirmasi Pesanan"}
        </button>
      </form>
    </div>
  );
}
