import prisma from "@/lib/prisma";
import Image from "next/image";
import { BookOpen, Plus } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import Link from "next/link";
import DeleteBookButton from "./DeleteBookButton";

/**
 * Halaman manajemen buku (Admin).
 * Menampilkan daftar buku dengan opsi CRUD.
 */
export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Manajemen Buku
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola koleksi buku di toko Anda.
          </p>
        </div>
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Buku
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {books.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada buku. Tambahkan buku pertama Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Buku</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Harga</th>
                  <th className="px-6 py-3">Stok</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={book.imageUrl}
                          alt={book.title}
                          width={40}
                          height={48}
                          className="object-cover rounded"
                        />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-50">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-gray-600">
                        {book.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {formatRupiah(book.price)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-sm font-medium ${
                          book.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {formatDate(book.createdAt)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteBookButton id={book.id} title={book.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
