"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

type CategoryActionState = {
  success: boolean;
  message: string;
  category?: {
    id: string;
    name: string;
  };
};

function normalizeCategoryName(value: string) {
  return value.trim();
}

async function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/books");
  revalidatePath("/admin/books/new");
}

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
): Promise<CategoryActionState> {
  await requireAdmin();

  const name = normalizeCategoryName(String(formData.get("name") ?? ""));

  if (!name) {
    return { success: false, message: "Nama kategori tidak boleh kosong." };
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name },
    });

    if (existing) {
      return { success: false, message: "Nama kategori sudah digunakan." };
    }

    const category = await prisma.category.create({
      data: { name },
      select: { id: true, name: true },
    });

    await revalidateCategoryPaths();
    return { success: true, message: "Kategori berhasil ditambahkan.", category };
  } catch (error) {
    console.error("Gagal menambah kategori:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

export async function createCategoryInline(name: string): Promise<CategoryActionState> {
  await requireAdmin();

  const normalizedName = normalizeCategoryName(name);

  if (!normalizedName) {
    return { success: false, message: "Nama kategori tidak boleh kosong." };
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name: normalizedName },
      select: { id: true, name: true },
    });

    if (existing) {
      return {
        success: false,
        message: "Nama kategori sudah digunakan.",
        category: existing,
      };
    }

    const category = await prisma.category.create({
      data: { name: normalizedName },
      select: { id: true, name: true },
    });

    await revalidateCategoryPaths();
    return { success: true, message: "Kategori baru siap dipakai.", category };
  } catch (error) {
    console.error("Gagal menambah kategori inline:", error);
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
): Promise<CategoryActionState> {
  await requireAdmin();

  const name = normalizeCategoryName(String(formData.get("name") ?? ""));

  if (!name) {
    return { success: false, message: "Nama kategori tidak boleh kosong." };
  }

  try {
    const existing = await prisma.category.findFirst({
      where: { name, NOT: { id } },
    });

    if (existing) {
      return { success: false, message: "Nama kategori sudah digunakan." };
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
      select: { id: true, name: true },
    });

    await revalidateCategoryPaths();
    return { success: true, message: "Kategori berhasil diperbarui.", category };
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
    const category = await prisma.category.findUnique({
      where: { id },
      select: { _count: { select: { books: true } } },
    });

    if (!category) {
      return { success: false, message: "Kategori tidak ditemukan." };
    }

    if (category._count.books > 0) {
      return {
        success: false,
        message: "Kategori masih dipakai buku. Pindahkan atau ubah kategori buku terlebih dulu.",
      };
    }

    await prisma.category.delete({ where: { id } });
    await revalidateCategoryPaths();
    return { success: true, message: "Kategori berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
