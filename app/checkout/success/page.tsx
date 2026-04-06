import { CheckCircle, ArrowRight } from "@/components/icons";
import Link from "next/link";

/**
 * Halaman konfirmasi setelah pesanan berhasil dibuat.
 */
export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="inline-flex p-4 bg-green-50 rounded-full mb-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Pesanan Berhasil!
      </h1>
      <p className="text-gray-600 mb-8">
        Terima kasih atas pesanan Anda. Tim kami akan segera memproses pengiriman
        buku Anda. Silakan cek status pesanan di halaman akun Anda.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Lanjut Belanja
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
