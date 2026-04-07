"use client";

import { CheckCircle, Loader2, ShoppingCart } from "@/components/icons";
import { addToCart } from "@/lib/actions/cart";
import { useState, useTransition } from "react";

/**
 * Props untuk komponen AddToCartButton.
 */
interface AddToCartButtonProps {
  bookId: string;
  inStock: boolean;
}

/**
 * Tombol interaktif untuk menambahkan buku ke keranjang.
 */
export default function AddToCartButton({ bookId, inStock }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  /**
   * Menangani klik tombol tambah ke keranjang.
   */
  function handleClick() {
    startTransition(async () => {
      const result = await addToCart(bookId);
      setFeedback(result);
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={!inStock || isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        {isPending
          ? "Menambahkan..."
          : inStock
          ? "Tambah ke Keranjang"
          : "Stok Habis"}
      </button>

      <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-relaxed text-slate-500">
        Satu klik untuk menaruh buku ini ke keranjang, lalu Anda bisa lanjut ke checkout kapan saja.
      </div>

      {feedback ? (
        <div
          className={`rounded-[22px] border px-4 py-3 text-sm ${
            feedback.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <div className="flex items-start gap-2">
            {feedback.success ? <CheckCircle className="mt-0.5 h-4 w-4" /> : <ShoppingCart className="mt-0.5 h-4 w-4" />}
            <p>{feedback.message}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
