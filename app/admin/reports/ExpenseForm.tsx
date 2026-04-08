"use client";

import { useActionState } from "react";
import { createExpense } from "@/lib/actions/expenses";
import { CheckCircle, Loader2, X } from "@/components/icons";

const initialPaidAt = new Date().toISOString().slice(0, 10);

export default function ExpenseForm() {
  const [state, formAction, isPending] = useActionState(createExpense, {
    success: false,
    message: "",
  });

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Cash Out
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-900">
          Catat biaya operasional
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Pakai form ini untuk mencatat biaya yang memengaruhi laporan keuangan, seperti iklan, kemasan, kurir internal, atau operasional harian.
        </p>
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        {state.message ? (
          <div
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
              state.success
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="categoryName" className="mb-2 block text-sm font-semibold text-slate-700">
              Kategori biaya
            </label>
            <input
              id="categoryName"
              name="categoryName"
              type="text"
              required
              className="editorial-input rounded-2xl px-4 py-3.5 text-sm text-slate-900"
              placeholder="Contoh: Operasional"
            />
          </div>

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
              Judul biaya
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="editorial-input rounded-2xl px-4 py-3.5 text-sm text-slate-900"
              placeholder="Contoh: Cetak stiker packing"
            />
          </div>

          <div>
            <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-slate-700">
              Nominal
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min={1}
              required
              className="editorial-input rounded-2xl px-4 py-3.5 text-sm text-slate-900"
              placeholder="250000"
            />
          </div>

          <div>
            <label htmlFor="paidAt" className="mb-2 block text-sm font-semibold text-slate-700">
              Tanggal dibayar
            </label>
            <input
              id="paidAt"
              name="paidAt"
              type="date"
              required
              defaultValue={initialPaidAt}
              className="editorial-input rounded-2xl px-4 py-3.5 text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-slate-700">
            Catatan
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="editorial-input min-h-[120px] rounded-2xl px-4 py-3.5 text-sm text-slate-900"
            placeholder="Opsional: nomor invoice vendor, alasan biaya, atau catatan internal."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Simpan biaya
        </button>
      </form>
    </div>
  );
}