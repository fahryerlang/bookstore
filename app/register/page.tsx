"use client";

import { useActionState } from "react";
import { registerUser } from "@/lib/actions/auth";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  ShieldCheck,
  Star,
  UserRoundPlus,
} from "lucide-react";

const inputClasses =
  "w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-white outline-none transition-all placeholder:text-white/35 focus:border-primary/70 focus:bg-white/8 focus:ring-4 focus:ring-primary/12";

/**
 * Halaman registrasi pengguna baru.
 */
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    message: "",
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1280&fit=crop"
          alt="Interior perpustakaan hangat"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,110,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
          <section className="rounded-[32px] border border-white/10 bg-dark-light/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="mb-8 text-center lg:text-left">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="rounded-2xl bg-primary p-2.5">
                  <BookOpen className="h-5 w-5 text-dark" />
                </div>
                <span className="text-xl font-bold uppercase tracking-[0.24em] text-white">
                  BookStore
                </span>
              </Link>

              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                Buat akun baru
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
                Daftarkan akun untuk menyimpan keranjang, memantau pesanan,
                dan menikmati pengalaman yang lebih personal.
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              {state.message && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    state.success
                      ? "border border-emerald-400/18 bg-emerald-500/10 text-emerald-200"
                      : "border border-red-400/18 bg-red-500/10 text-red-200"
                  }`}
                >
                  {state.message}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={inputClasses}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={inputClasses}
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Kata Sandi
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className={inputClasses}
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className={inputClasses}
                    placeholder="Ulangi kata sandi"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold uppercase tracking-[0.16em] text-dark transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Memproses" : "Daftar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/58 lg:text-left">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-primary-light"
              >
                Masuk di sini
              </Link>
            </p>
          </section>

          <section className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Beranda
              </Link>

              <div className="mt-8 flex items-center gap-2 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-primary" />
                ))}
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.32em] text-primary">
                New Reader Club
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                Buat akun baru dan masuk ke pengalaman belanja yang lebih personal.
              </h1>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/10 bg-dark-light/70 p-5">
                <UserRoundPlus className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-white">
                  Mulai cepat
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Setelah daftar, Anda bisa langsung login dan mulai menjelajahi katalog.
                </p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-dark-light/70 p-5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-white">
                  Data tetap aman
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Form dibuat lebih jelas dan nyaman dibaca di desktop maupun mobile.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
