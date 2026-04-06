"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/categories";
import { Loader2, Plus, CheckCircle, X } from "@/components/icons";

export default function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, {
    success: false,
    message: "",
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          Tambah Kategori
        </h2>
      </div>

      <form action={formAction} className="p-6 space-y-5">
        {state.message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              state.success
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0" />
            )}
            {state.message}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nama Kategori
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            placeholder="Contoh: Fiksi Ilmiah"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : "Simpan Kategori"}
        </button>
      </form>
    </div>
  );
}
