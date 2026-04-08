"use client";

import { useTransition } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Loader2, Trash2 } from "@/components/icons";

interface DeleteExpenseButtonProps {
  id: string;
  title: string;
}

export default function DeleteExpenseButton({ id, title }: DeleteExpenseButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus biaya \"${title}\" dari laporan keuangan?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteExpense(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      Hapus
    </button>
  );
}