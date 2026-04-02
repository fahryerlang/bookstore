"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

/**
 * Menambahkan kategori buku baru.
 *
 * @param {unknown} _prevState - State sebelumnya dari useActionState.
 * @param {FormData} formData - Data formulir kategori.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function createCategory(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { success: false, message: "Nama kategori tidak boleh kosong." };
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return { success: false, message: "Nama kategori sudah digunakan." };
    }

    await prisma.category.create({
      data: { name: name.trim() },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori berhasil ditambahkan." };
  } catch (error) {
    console.error("Gagal menambah kategori:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Memperbarui nama kategori.
 *
 * @param {string} id - ID kategori.
 * @param {unknown} _prevState - State sebelumnya.
 * @param {FormData} formData - Data formulir.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function updateCategory(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { success: false, message: "Nama kategori tidak boleh kosong." };
  }

  try {
    const existing = await prisma.category.findFirst({
      where: { name: name.trim(), NOT: { id } },
    });

    if (existing) {
      return { success: false, message: "Nama kategori sudah digunakan." };
    }

    await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori berhasil diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui kategori:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Menghapus kategori berdasarkan ID.
 *
 * @param {string} id - ID kategori yang akan dihapus.
 */
export async function deleteCategory(id: string) {
  await requireAdmin();

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
