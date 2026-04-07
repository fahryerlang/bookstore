"use client";

import { Trash2, Loader2 } from "@/components/icons";
import { deleteBook } from "@/lib/actions/books";
import { useTransition } from "react";

/**
 * Props untuk komponen DeleteBookButton.
 */
interface DeleteBookButtonProps {
  id: string;
  title: string;
}

/**
 * Tombol hapus buku dengan konfirmasi.
 */
export default function DeleteBookButton({ id, title }: DeleteBookButtonProps) {
  const [isPending, startTransition] = useTransition();

  /**
   * Menangani klik tombol hapus dengan konfirmasi.
   */
  function handleDelete() {
    if (!confirm(`Yakin ingin menghapus buku "${title}"?`)) return;
    startTransition(async () => {
      await deleteBook(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Hapus buku ${title}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all duration-200 hover:bg-red-100 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Menghapus...</span>
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          <span>Hapus</span>
        </>
      )}
    </button>
  );
}
