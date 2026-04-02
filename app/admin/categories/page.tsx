import prisma from "@/lib/prisma";
import { FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CategoryForm from "./CategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";

/**
 * Halaman manajemen kategori buku (Admin).
 */
export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-indigo-600" />
          Manajemen Kategori
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola kategori buku di toko Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div>
          <CategoryForm />
        </div>

        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Daftar Kategori ({categories.length})
              </h2>
            </div>
            {categories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Belum ada kategori.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Nama</th>
                      <th className="px-6 py-3">Jumlah Buku</th>
                      <th className="px-6 py-3">Tanggal Dibuat</th>
                      <th className="px-6 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {cat.name}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {cat._count.books} buku
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {formatDate(cat.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <DeleteCategoryButton id={cat.id} name={cat.name} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
