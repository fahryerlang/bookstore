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
 * Komponen kartu buku dengan styling luxury dark + gold.
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
      <div className="bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group-hover:-translate-y-1">
        {/* Book Image */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-xs bg-red-600 px-3 py-1 uppercase tracking-wider">
                Habis
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Book Info */}
        <div className="p-4">
          <span className="text-xs font-medium text-primary uppercase tracking-[0.15em]">
            {category}
          </span>
          <h3 className="mt-1.5 text-sm font-bold text-dark line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-base font-bold text-dark">
              {formatRupiah(price)}
            </p>
            <div className="p-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-dark transition-colors duration-300">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
