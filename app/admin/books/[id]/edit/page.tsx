import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Pencil } from "@/components/icons";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Buku</h1>
        <p className="text-gray-500 mt-1">
          Perbarui informasi buku &quot;{book.title}&quot;.
        </p>
      </div>

      <BookForm categories={categories} book={book} />
    </div>
  );
}
