"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession, clearSession, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Mendaftarkan pengguna baru ke sistem.
 *
 * @param {unknown} _prevState - State sebelumnya dari useActionState.
 * @param {FormData} formData - Data formulir registrasi.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerUser(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  if (password.length < 6) {
    return { success: false, message: "Kata sandi minimal 6 karakter." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Konfirmasi kata sandi tidak cocok." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error) {
    console.error("Gagal registrasi:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Mengautentikasi pengguna dan membuat session.
 *
 * @param {unknown} _prevState - State sebelumnya dari useActionState.
 * @param {FormData} formData - Data formulir login.
 * @returns {Promise<{success: boolean, message: string, redirectTo?: string}>}
 */
export async function loginUser(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string; redirectTo?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email dan kata sandi wajib diisi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Email atau kata sandi salah." };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, message: "Email atau kata sandi salah." };
    }

    await setSession(user.id);

    return {
      success: true,
      message: "Login berhasil!",
      redirectTo: user.role === "ADMIN" ? "/admin" : "/dashboard",
    };
  } catch (error) {
    console.error("Gagal login:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

/**
 * Menghapus session pengguna (logout).
 */
export async function logoutUser() {
  await clearSession();
  redirect("/login");
}

/**
 * Memperbarui profil pengguna yang sedang login.
 */
export async function updateProfile(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, message: "Sesi Anda sudah berakhir. Silakan login kembali." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name || !email) {
    return { success: false, message: "Nama dan email wajib diisi." };
  }

  if (name.length < 3) {
    return { success: false, message: "Nama minimal 3 karakter." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, message: "Format email tidak valid." };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.id },
      },
      select: { id: true },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah dipakai akun lain." };
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { name, email },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/profile");
    revalidatePath("/checkout");

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Gagal memperbarui profil:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
