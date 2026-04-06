"use client";

import { Minus, Plus, Trash2, Loader2 } from "@/components/icons";
import Image from "next/image";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { formatRupiah } from "@/lib/utils";
import { useTransition } from "react";

/**
 * Props untuk komponen CartItemRow.
 */
interface CartItemRowProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

/**
 * Baris item di keranjang belanja dengan kontrol kuantitas.
 */
export default function CartItemRow({
  id,
  title,
  price,
  imageUrl,
  quantity,
  stock,
}: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();

  /**
   * Mengubah kuantitas item keranjang.
   */
  function handleQuantity(newQty: number) {
    startTransition(async () => {
      await updateCartItem(id, newQty);
    });
  }

  /**
   * Menghapus item dari keranjang.
   */
  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(id);
    });
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <Image
        src={imageUrl}
        alt={title}
        width={80}
        height={96}
        className="object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-indigo-600 font-semibold mt-1">
          {formatRupiah(price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantity(quantity - 1)}
          disabled={isPending || quantity <= 1}
          className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-8 text-center font-medium text-gray-900">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            quantity
          )}
        </span>

        <button
          onClick={() => handleQuantity(quantity + 1)}
          disabled={isPending || quantity >= stock}
          className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="font-semibold text-gray-900 w-28 text-right">
        {formatRupiah(price * quantity)}
      </p>

      <button
        onClick={handleRemove}
        disabled={isPending}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
