"use client";

import { useActionState, useState } from "react";
import BookCoverImage from "@/components/BookCoverImage";
import { createOrder } from "@/lib/actions/orders";
import { paymentOptions, shippingOptions } from "@/lib/checkout";
import { formatRupiah } from "@/lib/utils";
import {
  Banknote,
  CheckCircle,
  Clock3,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "@/components/icons";

interface CheckoutCartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryName: string;
}

interface CheckoutFormProps {
  userName: string;
  userEmail: string;
  cartItems: CheckoutCartItem[];
  subtotalAmount: number;
  selectedCartItemIds: string[];
  defaultCheckout?: {
    recipientName: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    orderNotes?: string;
    shippingService: string;
    paymentMethod: string;
    shippingLabel: string;
    paymentLabel: string;
    updatedAt: string;
  } | null;
}

/**
 * Formulir checkout untuk memasukkan alamat pengiriman.
 */
export default function CheckoutForm({
  userName,
  userEmail,
  cartItems,
  subtotalAmount,
  selectedCartItemIds,
  defaultCheckout,
}: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(createOrder, {
    success: false,
    message: "",
  });
  const initialShippingId =
    shippingOptions.find((option) => option.id === defaultCheckout?.shippingService)?.id ??
    shippingOptions[0]?.id ??
    "";
  const initialPaymentId =
    paymentOptions.find((option) => option.id === defaultCheckout?.paymentMethod)?.id ??
    paymentOptions[0]?.id ??
    "";

  const [selectedShippingId, setSelectedShippingId] = useState(initialShippingId);
  const [selectedPaymentId, setSelectedPaymentId] = useState(initialPaymentId);

  const selectedShipping =
    shippingOptions.find((option) => option.id === selectedShippingId) ?? shippingOptions[0];
  const selectedPayment =
    paymentOptions.find((option) => option.id === selectedPaymentId) ?? paymentOptions[0];

  const shippingFee = selectedShipping?.fee ?? 0;
  const serviceFee = selectedPayment?.fee ?? 0;
  const grandTotal = subtotalAmount + shippingFee + serviceFee;

  return (
    <form action={formAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      {selectedCartItemIds.map((cartItemId) => (
        <input key={cartItemId} type="hidden" name="selectedCartItemIds" value={cartItemId} />
      ))}

      <div className="space-y-6">
        <section className="editorial-surface rounded-[28px] p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Customer Details
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                  Detail penerima dan alamat
                </h2>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Lengkapi data utama pesanan seperti di checkout toko online pada umumnya.
              </p>
            </div>

            <div className="rounded-[22px] border border-primary/15 bg-primary-50 px-4 py-3 text-sm leading-relaxed text-primary-900">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="max-w-xs">
                  Data kontak dipakai untuk konfirmasi pesanan dan proses pengiriman.
                </p>
              </div>
            </div>
          </div>

          {state.message && (
            <div
              className={`mt-6 rounded-[20px] border px-4 py-3 text-sm ${
                state.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {state.message}
            </div>
          )}

          {defaultCheckout ? (
            <div className="mt-6 rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Form sudah diisi dari checkout terakhir.
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Dipakai terakhir {defaultCheckout.updatedAt}. Kurir {defaultCheckout.shippingLabel} dan pembayaran {defaultCheckout.paymentLabel} ikut dipilih otomatis, tetapi tetap bisa Anda ubah.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-semibold text-slate-700">
                Nama Penerima
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <input
                  id="recipientName"
                  name="recipientName"
                  type="text"
                  required
                  defaultValue={defaultCheckout?.recipientName ?? userName}
                  autoComplete="name"
                  className="editorial-input rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder="Nama lengkap penerima"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-slate-700">
                Email Aktif
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  required
                  defaultValue={defaultCheckout?.contactEmail ?? userEmail}
                  autoComplete="email"
                  className="editorial-input rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700">
                Nomor Telepon
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  defaultValue={defaultCheckout?.phoneNumber ?? ""}
                  autoComplete="tel"
                  className="editorial-input rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder="Contoh: 0812 3456 7890"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="shippingAddress" className="block text-sm font-semibold text-slate-700">
                Alamat Lengkap
              </label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                rows={5}
                required
                defaultValue={defaultCheckout?.address ?? ""}
                autoComplete="street-address"
                className="editorial-input mt-2 min-h-40 resize-none rounded-[24px] px-5 py-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400"
                placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota, provinsi, kode pos, dan patokan lokasi."
              />
            </div>
          </div>
        </section>

        <section className="editorial-surface rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Shipping Method
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Pilih layanan pengiriman
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {shippingOptions.map((option) => {
              const checked = selectedShippingId === option.id;

              return (
                <label
                  key={option.id}
                  className={`group relative cursor-pointer rounded-[24px] border p-4 transition-all ${
                    checked
                      ? "border-primary/30 bg-primary-50 shadow-[0_24px_60px_-48px_rgba(37,99,235,0.85)]"
                      : "border-slate-200 bg-white hover:border-primary/20 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingService"
                    value={option.id}
                    checked={checked}
                    onChange={() => setSelectedShippingId(option.id)}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {option.badge}
                      </p>
                    </div>
                    {checked ? <CheckCircle className="h-5 w-5 text-primary" /> : null}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{option.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      {option.eta}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(option.fee)}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section className="editorial-surface rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Payment Method
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Pilih metode pembayaran
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {paymentOptions.map((option) => {
              const checked = selectedPaymentId === option.id;

              return (
                <label
                  key={option.id}
                  className={`group relative cursor-pointer rounded-[24px] border p-4 transition-all ${
                    checked
                      ? "border-primary/30 bg-primary-50 shadow-[0_24px_60px_-48px_rgba(37,99,235,0.85)]"
                      : "border-slate-200 bg-white hover:border-primary/20 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={checked}
                    onChange={() => setSelectedPaymentId(option.id)}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {option.category}
                      </p>
                    </div>
                    {checked ? <CheckCircle className="h-5 w-5 text-primary" /> : null}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{option.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {option.badge}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(option.fee)}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6">
            <label htmlFor="orderNotes" className="block text-sm font-semibold text-slate-700">
              Catatan Pesanan
            </label>
            <textarea
              id="orderNotes"
              name="orderNotes"
              rows={4}
              defaultValue={defaultCheckout?.orderNotes ?? ""}
              className="editorial-input mt-2 min-h-32 resize-none rounded-[24px] px-5 py-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400"
              placeholder="Contoh: titip paket di satpam, kirim setelah jam 17.00, atau instruksi tambahan lain."
            />
          </div>
        </section>
      </div>

      <aside>
        <section className="editorial-surface sticky top-28 rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Live Summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Ringkasan checkout
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              {cartItems.length} judul dipilih
            </div>
          </div>

          <div className="mt-5 max-h-[320px] space-y-3 overflow-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/85 p-3"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[16px] border border-slate-200 bg-white">
                  <BookCoverImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {item.categoryName}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
                    {item.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                    <span>{item.quantity} × {formatRupiah(item.price)}</span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(item.quantity * item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal buku</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(subtotalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ongkir {selectedShipping?.label}</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(shippingFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Biaya layanan {selectedPayment?.label}</span>
              <span className="font-semibold text-slate-900">
                {formatRupiah(serviceFee)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[22px] border border-primary/10 bg-primary-50/85 px-4 py-4">
              <span className="text-base font-semibold text-slate-900">Grand total</span>
              <span className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <Banknote className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedPayment?.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {selectedPayment?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Memproses Pesanan..." : "Buat Pesanan"}
            </button>

            <p className="text-center text-xs leading-relaxed text-slate-400">
              Dengan konfirmasi ini, stok diperiksa sekali lagi sebelum order final dibuat.
            </p>
          </div>
        </section>
      </aside>
    </form>
  );
}
