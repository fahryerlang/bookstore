import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Nama cookie untuk menyimpan session ID pengguna.
 */
const SESSION_COOKIE = "bookstore_session";
const SESSION_ROLE_COOKIE = "bookstore_role";

/**
 * Mengatur cookie session setelah login berhasil.
 *
 * @param {string} userId - ID pengguna yang login.
 */
export async function setSession(userId: string, role?: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  if (role) {
    cookieStore.set(SESSION_ROLE_COOKIE, role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }
}

/**
 * Mendapatkan session pengguna dari cookie.
 *
 * @returns {Promise<{id: string, name: string, email: string, role: string} | null>}
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}

/**
 * Menghapus cookie session (logout).
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_ROLE_COOKIE);
}

/**
 * Memastikan pengguna sudah login, redirect ke login jika belum.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Memastikan pengguna adalah Admin, redirect jika bukan.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");
  return session;
}
