"use client";

import { Trash2, Loader2 } from "@/components/icons";
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
