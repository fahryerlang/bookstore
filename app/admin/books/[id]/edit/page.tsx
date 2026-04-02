import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import BookForm from "../../new/BookForm";

/**
 * Props untuk halaman edit buku.
 */
interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman edit buku (Admin).
 */
export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Pencil className="h-6 w-6 text-indigo-600" />
          Edit Buku
        </h1>
        <p className="text-gray-500 mt-1">
          Perbarui informasi buku &quot;{book.title}&quot;.
        </p>
      </div>

      <BookForm categories={categories} book={book} />
    </div>
  );
}
