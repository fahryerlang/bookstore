"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { useTransition } from "react";

/**
 * Props untuk komponen DeleteCategoryButton.
 */
interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

/**
 * Tombol hapus kategori dengan konfirmasi.
 */
export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  /**
   * Menangani klik tombol hapus dengan konfirmasi.
   */
  function handleDelete() {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"? Semua buku dalam kategori ini juga akan dihapus.`)) {
      return;
    }
    startTransition(async () => {
      await deleteCategory(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
