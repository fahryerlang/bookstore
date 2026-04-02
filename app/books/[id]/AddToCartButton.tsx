"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
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
  const [message, setMessage] = useState("");

  /**
   * Menangani klik tombol tambah ke keranjang.
   */
  function handleClick() {
    startTransition(async () => {
      const result = await addToCart(bookId);
      setMessage(result.message);
      setTimeout(() => setMessage(""), 3000);
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={!inStock || isPending}
        className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
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
      {message && (
        <p className="mt-3 text-center text-sm font-medium text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}
