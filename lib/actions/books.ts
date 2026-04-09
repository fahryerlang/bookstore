"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BOOK_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "books");
const BOOK_UPLOAD_PREFIX = "/uploads/books";
const MAX_BOOK_COVER_BYTES = 5 * 1024 * 1024;
const COVER_EXTENSION_BY_TYPE = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

type ResolvedBookImageSource =
  | { imageUrl: string; uploadedImageUrl?: undefined }
  | { imageUrl: string; uploadedImageUrl: string }
  | { error: string };

function sanitizeFileSegment(value: string) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return sanitized || "cover";
}

function isLocalBookCover(imageUrl?: string | null): imageUrl is string {
  return Boolean(imageUrl?.startsWith(`${BOOK_UPLOAD_PREFIX}/`));
}

async function removeLocalBookCover(imageUrl?: string | null) {
  if (!isLocalBookCover(imageUrl)) {
    return;
  }

  const absolutePath = join(process.cwd(), "public", imageUrl.replace(/^\/+/, ""));

  try {
    await unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Gagal menghapus cover lokal:", error);
    }
  }
}

async function persistUploadedBookCover(
  file: File,
  title: string
): Promise<ResolvedBookImageSource> {
  if (!COVER_EXTENSION_BY_TYPE.has(file.type)) {
    return { error: "Format gambar harus JPG, PNG, WEBP, atau GIF." };
  }

  if (file.size > MAX_BOOK_COVER_BYTES) {
    return { error: "Ukuran cover maksimal 5MB." };
  }

  await mkdir(BOOK_UPLOAD_DIR, { recursive: true });

  const extension = COVER_EXTENSION_BY_TYPE.get(file.type) ?? ".jpg";
  const filename = `${sanitizeFileSegment(title)}-${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const absolutePath = join(BOOK_UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, buffer);

  return {
    imageUrl: `${BOOK_UPLOAD_PREFIX}/${filename}`,
  };
}

async function resolveBookImageSource(
  formData: FormData,
  title: string,
  existingImageUrl?: string
): Promise<ResolvedBookImageSource> {
  const imageUrlInput = String(formData.get("imageUrl") ?? "").trim();
  const coverFile = formData.get("coverFile");
  const uploadedFile = coverFile instanceof File && coverFile.size > 0 ? coverFile : null;

  if (uploadedFile) {
    const uploadedCover = await persistUploadedBookCover(uploadedFile, title);

    if ("error" in uploadedCover) {
      return uploadedCover;
    }

    return {
      imageUrl: uploadedCover.imageUrl,
      uploadedImageUrl: uploadedCover.imageUrl,
    };
  }

  if (imageUrlInput) {
    return { imageUrl: imageUrlInput };
  }

  if (existingImageUrl) {
    return { imageUrl: existingImageUrl };
  }

  return { error: "Masukkan URL cover atau upload gambar dari folder lokal." };
}

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

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const costPrice = Number(formData.get("costPrice"));
  const stock = Number(formData.get("stock"));
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!title || !author || !description || !categoryId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  if (
    !Number.isInteger(price) ||
    !Number.isInteger(costPrice) ||
    !Number.isInteger(stock) ||
    price <= 0 ||
    costPrice < 0 ||
    stock < 0
  ) {
    return { success: false, message: "Harga jual, harga modal, dan stok harus valid." };
  }

  const resolvedImage = await resolveBookImageSource(formData, title);

  if ("error" in resolvedImage) {
    return { success: false, message: resolvedImage.error };
  }

  const uploadedImageUrl =
    "uploadedImageUrl" in resolvedImage ? resolvedImage.uploadedImageUrl : undefined;

  try {
    await prisma.book.create({
      data: {
        title,
        author,
        description,
        price,
        costPrice,
        stock,
        imageUrl: resolvedImage.imageUrl,
        categoryId,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard");
    revalidatePath("/admin/reports");
    revalidatePath("/");
    revalidateTag("books", "max");
    return { success: true, message: "Buku berhasil ditambahkan." };
  } catch (error) {
    if (uploadedImageUrl) {
      await removeLocalBookCover(uploadedImageUrl);
    }

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

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const costPrice = Number(formData.get("costPrice"));
  const stock = Number(formData.get("stock"));
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!title || !author || !description || !categoryId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  if (
    !Number.isInteger(price) ||
    !Number.isInteger(costPrice) ||
    !Number.isInteger(stock) ||
    price <= 0 ||
    costPrice < 0 ||
    stock < 0
  ) {
    return { success: false, message: "Harga jual, harga modal, dan stok harus valid." };
  }

  let uploadedImageUrl: string | undefined;

  try {
    const existingBook = await prisma.book.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!existingBook) {
      return { success: false, message: "Buku tidak ditemukan." };
    }

    const resolvedImage = await resolveBookImageSource(formData, title, existingBook.imageUrl);

    if ("error" in resolvedImage) {
      return { success: false, message: resolvedImage.error };
    }

    uploadedImageUrl =
      "uploadedImageUrl" in resolvedImage ? resolvedImage.uploadedImageUrl : undefined;

    await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        description,
        price,
        costPrice,
        stock,
        imageUrl: resolvedImage.imageUrl,
        categoryId,
      },
    });

    if (existingBook.imageUrl !== resolvedImage.imageUrl && isLocalBookCover(existingBook.imageUrl)) {
      await removeLocalBookCover(existingBook.imageUrl);
    }

    revalidatePath("/admin/books");
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard");
    revalidatePath("/admin/reports");
    revalidatePath("/");
    revalidatePath(`/books/${id}`);
    revalidateTag("books", "max");
    return { success: true, message: "Buku berhasil diperbarui." };
  } catch (error) {
    if (uploadedImageUrl) {
      await removeLocalBookCover(uploadedImageUrl);
    }

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
    const deletedBook = await prisma.book.delete({
      where: { id },
      select: { imageUrl: true },
    });

    if (isLocalBookCover(deletedBook.imageUrl)) {
      await removeLocalBookCover(deletedBook.imageUrl);
    }

    revalidatePath("/admin/books");
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard");
    revalidatePath("/admin/reports");
    revalidatePath("/");
    revalidateTag("books", "max");
    return { success: true, message: "Buku berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus buku:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
