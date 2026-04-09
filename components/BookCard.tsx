import Link from "next/link";
import BookCoverImage from "@/components/BookCoverImage";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Star } from "@/components/icons";

/**
 * Props untuk komponen BookCard.
 */
interface BookCardProps {
  id: string;
  title: string;
  author?: string | null;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  avgRating?: number;
  reviewCount?: number;
}

/**
 * Komponen kartu buku dengan gaya clean white + blue accent.
 */
export default function BookCard({
  id,
  title,
  author,
  price,
  imageUrl,
  category,
  stock,
  avgRating,
  reviewCount,
}: BookCardProps) {
  return (
    <Link href={`/books/${id}`} className="group">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_-30px_rgba(15,23,42,0.85)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_56px_-34px_rgba(15,23,42,0.7)]">
        {/* Book Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
          <BookCoverImage
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-xs bg-red-600 px-3 py-1 uppercase tracking-wider">
                Habis
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Book Info */}
        <div className="p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            {category}
          </span>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {author ? `Oleh ${author}` : "Penulis belum diisi"}
          </p>
          {avgRating !== undefined && avgRating > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400" style={{ fill: "currentColor" }} />
              <span className="text-xs font-semibold text-slate-700">{avgRating.toFixed(1)}</span>
              {reviewCount !== undefined && reviewCount > 0 && (
                <span className="text-[10px] text-slate-400">({reviewCount})</span>
              )}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-base font-bold text-slate-900">
              {formatRupiah(price)}
            </p>
            <div className="rounded-full bg-primary-50 p-2 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
