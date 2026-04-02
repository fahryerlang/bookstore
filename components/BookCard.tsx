import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

/**
 * Props untuk komponen BookCard.
 */
interface BookCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

/**
 * Komponen kartu buku untuk menampilkan informasi singkat buku di katalog.
 */
export default function BookCard({
  id,
  title,
  price,
  imageUrl,
  category,
  stock,
}: BookCardProps) {
  return (
    <Link href={`/books/${id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Book Image */}
        <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            {category}
          </span>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {formatRupiah(price)}
            </p>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
