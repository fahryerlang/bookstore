"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

/**
 * Mengirim pesan dari pengguna ke admin.
 *
 * @param {unknown} _prevState - State sebelumnya.
 * @param {FormData} formData - Data formulir pesan.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendMessage(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await requireAuth();

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  if (!subject || !content) {
    return { success: false, message: "Subjek dan isi pesan wajib diisi." };
  }

  try {
    await prisma.message.create({
      data: {
        userId: session.id,
        subject: subject.trim(),
        content: content.trim(),
      },
    });

    revalidatePath("/admin/messages");
    return { success: true, message: "Pesan berhasil dikirim." };
  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Menghapus pesan (Admin).
 *
 * @param {string} id - ID pesan.
 */
export async function deleteMessage(id: string) {
  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true, message: "Pesan berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus pesan:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
