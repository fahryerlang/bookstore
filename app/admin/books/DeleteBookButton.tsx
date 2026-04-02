"use client";

import { Trash2, Loader2 } from "lucide-react";
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
