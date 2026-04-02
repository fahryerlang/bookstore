import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, Package, Tag } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

/**
 * Props untuk halaman detail buku.
 */
interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman detail buku yang menampilkan informasi lengkap dan tombol beli.
 */
export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-3/4 relative rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
              {book.category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

          <p className="mt-4 text-3xl font-bold text-indigo-600">
            {formatRupiah(book.price)}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm font-medium ${
                book.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {book.stock > 0 ? `Stok: ${book.stock} tersedia` : "Stok habis"}
            </span>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Deskripsi
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          <div className="mt-auto pt-8">
            <AddToCartButton bookId={book.id} inStock={book.stock > 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
