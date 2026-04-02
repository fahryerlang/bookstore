"use client";

import { useActionState } from "react";
import { createCategory } from "@/lib/actions/categories";
import { Loader2, Plus } from "lucide-react";

/**
 * Formulir untuk menambah kategori baru.
 */
export default function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, {
    success: false,
    message: "",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-indigo-600" />
        Tambah Kategori
      </h2>

      <form action={formAction} className="space-y-4">
        {state.message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm ${
              state.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Nama Kategori
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
            placeholder="Contoh: Fiksi Ilmiah"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : "Simpan Kategori"}
        </button>
      </form>
    </div>
  );
}
