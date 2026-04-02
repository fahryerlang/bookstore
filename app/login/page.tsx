"use client";

import { useActionState } from "react";
import { loginUser } from "@/lib/actions/auth";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Halaman login untuk pengguna dan admin.
 */
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, {
    success: false,
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">BookStore</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p className="text-gray-500 mt-1">
            Selamat datang kembali! Silakan masuk.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form action={formAction} className="space-y-5">
            {state.message && !state.success && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.message}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
                placeholder="Masukkan kata sandi"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
