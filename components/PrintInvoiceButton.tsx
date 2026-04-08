"use client";

import { Printer } from "@/components/icons";

interface PrintInvoiceButtonProps {
  label?: string;
}

export default function PrintInvoiceButton({
  label = "Cetak / simpan PDF",
}: PrintInvoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}