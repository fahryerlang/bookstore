import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import BookForm from "./BookForm";

/**
 * Halaman tambah buku baru (Admin).
 */
export default async function NewBookPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plus className="h-6 w-6 text-indigo-600" />
          Tambah Buku Baru
        </h1>
        <p className="text-gray-500 mt-1">
          Tambahkan buku baru ke koleksi toko.
        </p>
      </div>

      <BookForm categories={categories} />
    </div>
  );
}
