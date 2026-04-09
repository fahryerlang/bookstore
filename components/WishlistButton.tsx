"use client";

import { Heart } from "@/components/icons";
import { toggleWishlist } from "@/lib/actions/wishlists";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface WishlistButtonProps {
  bookId: string;
  isWishlisted: boolean;
}

export default function WishlistButton({ bookId, isWishlisted }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          await toggleWishlist(bookId);
          router.refresh();
        });
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
        isWishlisted
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:text-red-400"
      } ${isPending ? "opacity-50" : ""}`}
      title={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart
        className="h-4 w-4"
        style={isWishlisted ? { fill: "currentColor" } : undefined}
      />
    </button>
  );
}
