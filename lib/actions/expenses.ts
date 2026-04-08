"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ExpenseActionState = {
  success: boolean;
  message: string;
};

function normalizeExpenseCategoryName(value: string) {
  return value.trim();
}

export async function createExpense(
  _prevState: unknown,
  formData: FormData
): Promise<ExpenseActionState> {
  await requireAdmin();

  const categoryName = normalizeExpenseCategoryName(String(formData.get("categoryName") ?? ""));
  const title = String(formData.get("title") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const paidAt = String(formData.get("paidAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!categoryName || !title || !paidAt) {
    return { success: false, message: "Kategori, judul biaya, dan tanggal wajib diisi." };
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    return { success: false, message: "Nominal biaya harus berupa angka bulat positif." };
  }

  const paidDate = new Date(`${paidAt}T00:00:00`);

  if (Number.isNaN(paidDate.getTime())) {
    return { success: false, message: "Tanggal pembayaran biaya belum valid." };
  }

  try {
    await prisma.expense.create({
      data: {
        title,
        amount,
        notes: notes || null,
        paidAt: paidDate,
        expenseCategory: {
          connectOrCreate: {
            where: { name: categoryName },
            create: { name: categoryName },
          },
        },
      },
    });

    revalidatePath("/admin/reports");
    return { success: true, message: "Biaya operasional berhasil dicatat." };
  } catch (error) {
    console.error("Gagal membuat expense:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

export async function deleteExpense(id: string) {
  await requireAdmin();

  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/admin/reports");
    return { success: true, message: "Biaya berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus expense:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}