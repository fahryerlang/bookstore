"use client";

import { useActionState } from "react";
import { createBook, updateBook } from "@/lib/actions/books";
import { Loader2 } from "lucide-react";

/**
 * Props untuk komponen BookForm.
 */
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

/**
 * Formulir untuk menambah atau mengedit buku.
 */
export default function BookForm({ categories, book }: BookFormProps) {
  const action = book ? updateBook.bind(null, book.id) : createBook;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: "",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
      <form action={formAction} className="space-y-5">
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
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Judul Buku
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={book?.title}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
            placeholder="Masukkan judul buku"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={book?.description}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-gray-900"
            placeholder="Deskripsi singkat buku"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Harga (Rp)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              required
              defaultValue={book?.price}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
              placeholder="50000"
            />
          </div>
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Stok
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min={0}
              required
              defaultValue={book?.stock}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={book?.categoryId}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
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
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            URL Gambar
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={book?.imageUrl}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
