import prisma from "@/lib/prisma";
import { Plus } from "@/components/icons";
import BookForm from "./BookForm";

/**
 * Halaman tambah buku baru (Admin).
 */
export default async function NewBookPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tambah Buku Baru</h1>
        <p className="text-gray-500 mt-1">
          Tambahkan buku baru ke koleksi toko.
        </p>
      </div>

      <BookForm categories={categories} />
    </div>
  );
}
