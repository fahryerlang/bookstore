"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

/**
 * Menambahkan buku baru ke katalog.
 *
 * @param {unknown} _prevState - State sebelumnya dari useActionState.
 * @param {FormData} formData - Data formulir buku.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function createBook(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  if (!title || !description || !price || !imageUrl || !categoryId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  if (price <= 0 || stock < 0) {
    return { success: false, message: "Harga dan stok harus valid." };
  }

  try {
    await prisma.book.create({
      data: { title, description, price, stock, imageUrl, categoryId },
    });

    revalidatePath("/admin/books");
    revalidatePath("/");
    return { success: true, message: "Buku berhasil ditambahkan." };
  } catch (error) {
    console.error("Gagal menambah buku:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Memperbarui data buku.
 *
 * @param {string} id - ID buku.
 * @param {unknown} _prevState - State sebelumnya.
 * @param {FormData} formData - Data formulir.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function updateBook(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  if (!title || !description || !price || !imageUrl || !categoryId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  try {
    await prisma.book.update({
      where: { id },
      data: { title, description, price, stock, imageUrl, categoryId },
    });

    revalidatePath("/admin/books");
    revalidatePath("/");
    revalidatePath(`/books/${id}`);
    return { success: true, message: "Buku berhasil diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui buku:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Menghapus buku berdasarkan ID.
 *
 * @param {string} id - ID buku.
 */
export async function deleteBook(id: string) {
  await requireAdmin();

  try {
    await prisma.book.delete({ where: { id } });
    revalidatePath("/admin/books");
    revalidatePath("/");
    return { success: true, message: "Buku berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus buku:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
