"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteMessage } from "@/lib/actions/messages";
import { useTransition } from "react";

/**
 * Props untuk komponen DeleteMessageButton.
 */
interface DeleteMessageButtonProps {
  id: string;
}

/**
 * Tombol hapus pesan dengan konfirmasi.
 */
export default function DeleteMessageButton({ id }: DeleteMessageButtonProps) {
  const [isPending, startTransition] = useTransition();

  /**
   * Menangani klik tombol hapus dengan konfirmasi.
   */
  function handleDelete() {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;
    startTransition(async () => {
      await deleteMessage(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors p-1"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
