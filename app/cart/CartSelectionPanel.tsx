"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle, ShoppingCart } from "@/components/icons";
import { formatRupiah } from "@/lib/utils";
import CartItemRow from "./CartItemRow";

interface CartSelectionItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  categoryName?: string;
}

interface CartSelectionPanelProps {
  items: CartSelectionItem[];
}

export default function CartSelectionPanel({ items }: CartSelectionPanelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => items.map((item) => item.id));

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );
  const selectedAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const hasSelection = selectedIds.length > 0;
  const checkoutHref = hasSelection ? `/checkout?items=${selectedIds.join(",")}` : "#";

  function toggleItem(itemId: string, checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(itemId) ? current : [...current, itemId];
      }

      return current.filter((id) => id !== itemId);
    });
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? items.map((item) => item.id) : []);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="editorial-surface rounded-[28px]">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Select For Checkout
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              Centang buku yang ingin dibayar
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Hanya item yang dicentang yang akan dibawa ke halaman checkout dan diproses menjadi order.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => toggleAll(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/25"
              />
              Pilih semua
            </label>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              <ShoppingCart className="h-4 w-4 text-primary" />
              {selectedIds.length} judul tercentang
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              imageUrl={item.imageUrl}
              quantity={item.quantity}
              stock={item.stock}
              categoryName={item.categoryName}
              checked={selectedIds.includes(item.id)}
              onCheckedChange={(checked) => toggleItem(item.id, checked)}
            />
          ))}
        </div>
      </section>

      <aside>
        <div className="editorial-surface sticky top-28 rounded-[28px] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Selected Summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Total item tercentang
          </h2>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Judul dipilih</span>
              <span className="font-semibold text-slate-900">{selectedIds.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total unit dipilih</span>
              <span className="font-semibold text-slate-900">{selectedQuantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status checkout</span>
              <span className={`font-semibold ${hasSelection ? "text-emerald-600" : "text-amber-600"}`}>
                {hasSelection ? "Siap lanjut" : "Pilih dulu"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-primary/10 bg-primary-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Nilai Terpilih
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
              {formatRupiah(selectedAmount)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Ongkir dan biaya layanan akan dihitung dari item yang Anda centang saat masuk ke checkout.
            </p>
          </div>

          {hasSelection ? (
            <Link
              href={checkoutHref}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-300 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            >
              Pilih item dulu
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-500">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
              <p>
                Anda bisa mencampur item: sebagian tetap di keranjang, sebagian lagi langsung diproses ke checkout.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}