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
  categoryName?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
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
  categoryName,
  checked = true,
  onCheckedChange,
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
    <div
      className={`group grid gap-4 p-5 transition-colors sm:grid-cols-[auto_96px_minmax(0,1fr)_auto] sm:items-center sm:p-6 ${
        checked ? "bg-primary-50/35" : "bg-white"
      }`}
    >
      <div className="flex items-start pt-1">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:border-primary/30 hover:bg-primary-50">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/25"
            aria-label={`Pilih ${title} untuk checkout`}
          />
        </label>
      </div>

      <div className="relative h-28 w-20 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-inner">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="80px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {categoryName ? (
            <span className="rounded-full border border-primary/15 bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-900">
              {categoryName}
            </span>
          ) : null}
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Stock {stock}
          </span>
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm font-semibold text-primary">
          {formatRupiah(price)}
          <span className="ml-1 font-medium text-slate-500">per buku</span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {stock > 3
            ? `${stock} stok siap diproses untuk pesanan ini.`
            : `Sisa ${stock} stok. Sebaiknya konfirmasi pesanan lebih cepat.`}
        </p>

        {!checked ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">
            Tidak ikut checkout sampai dicentang.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleQuantity(quantity - 1)}
            disabled={isPending || quantity <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="flex w-10 items-center justify-center text-sm font-semibold text-slate-900">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              quantity
            )}
          </span>

          <button
            type="button"
            onClick={() => handleQuantity(quantity + 1)}
            disabled={isPending || quantity >= stock}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Subtotal
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatRupiah(price * quantity)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
}
