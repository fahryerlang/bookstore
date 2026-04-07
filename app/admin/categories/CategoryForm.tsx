"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { Loader2, Plus, CheckCircle, X, Pencil } from "@/components/icons";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: "",
  });
  const isEditMode = Boolean(category);
  const submitLabel = isPending
    ? isEditMode
      ? "Menyimpan Perubahan..."
      : "Menyimpan..."
    : isEditMode
      ? "Perbarui Kategori"
      : "Simpan Kategori";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
            {isEditMode ? (
              <Pencil className="h-4 w-4 text-primary" />
            ) : (
              <Plus className="h-4 w-4 text-primary" />
            )}
          </div>
          {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {isEditMode
            ? "Perbarui nama kategori yang dipilih lalu simpan perubahan agar katalog tetap konsisten."
            : "Tambahkan kategori baru untuk menjaga struktur katalog tetap rapi dan mudah dicari."}
        </p>
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
            defaultValue={category?.name ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            placeholder={isEditMode ? "Perbarui nama kategori" : "Contoh: Fiksi Ilmiah"}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isEditMode ? (
            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Batal
            </Link>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
