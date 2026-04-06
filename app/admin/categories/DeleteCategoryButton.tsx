"use client";

import { Trash2, Loader2 } from "@/components/icons";
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
      className="rounded-lg border border-transparent p-2 text-slate-400 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
