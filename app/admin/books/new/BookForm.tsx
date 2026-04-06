"use client";

import { useActionState } from "react";
import { createBook, updateBook } from "@/lib/actions/books";
import { Loader2, CheckCircle, X } from "@/components/icons";

interface BookFormProps {
  categories: { id: string; name: string }[];
  book?: {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
  };
}

export default function BookForm({ categories, book }: BookFormProps) {
  const action = book ? updateBook.bind(null, book.id) : createBook;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: "",
  });

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-dark/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-white placeholder-gray-600 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-dark-light/60 backdrop-blur p-8 max-w-2xl">
      <form action={formAction} className="space-y-6">
        {state.message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              state.success
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
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
          <label htmlFor="title" className={labelClass}>
            Judul Buku
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={book?.title}
            className={inputClass}
            placeholder="Masukkan judul buku"
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={book?.description}
            className={`${inputClass} resize-none`}
            placeholder="Deskripsi singkat buku"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="price" className={labelClass}>
              Harga (Rp)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              required
              defaultValue={book?.price}
              className={inputClass}
              placeholder="50000"
            />
          </div>
          <div>
            <label htmlFor="stock" className={labelClass}>
              Stok
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min={0}
              required
              defaultValue={book?.stock}
              className={inputClass}
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className={labelClass}>
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={book?.categoryId}
            className={inputClass}
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="imageUrl" className={labelClass}>
            URL Gambar
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={book?.imageUrl}
            className={inputClass}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-dark py-3 px-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending
            ? "Menyimpan..."
            : book
            ? "Perbarui Buku"
            : "Simpan Buku"}
        </button>
      </form>
    </div>
  );
}
