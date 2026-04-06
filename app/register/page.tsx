"use client";

import { useActionState } from "react";
import { registerUser } from "@/lib/actions/auth";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "@/components/icons";
import BrandLogo from "@/components/BrandLogo";

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15";

const membershipPoints = [
  {
    title: "Profil pembaca tersimpan",
    description:
      "Simpan histori aktivitas dan preferensi bacaan untuk rekomendasi lebih akurat.",
    icon: UserRoundPlus,
  },
  {
    title: "Transaksi tetap aman",
    description:
      "Alur autentikasi dibuat jelas dengan validasi yang konsisten dari awal.",
    icon: ShieldCheck,
  },
  {
    title: "Akses katalog cepat",
    description:
      "Setelah daftar, kamu bisa langsung menelusuri koleksi terbaru tanpa hambatan.",
    icon: BookOpen,
  },
];

const confidenceStats = [
  { value: "18K+", label: "Active Members" },
  { value: "500+", label: "Curated Titles" },
  { value: "160+", label: "Publisher Partners" },
];

/**
 * Halaman registrasi pengguna baru.
 */
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    message: "",
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_bottom,_#ecf4ff_0%,_#f7fbff_34%,_#ffffff_72%)] text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-20 top-[34rem] h-80 w-80 rounded-full bg-sky-200/30 blur-3xl animate-drift-slow" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_36px_92px_-58px_rgba(15,23,42,0.72)] sm:p-5">
            <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-primary-50 via-white to-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <BrandLogo href="/" tone="dark" />

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </div>

              <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-900">
                <Sparkles className="h-3.5 w-3.5" />
                New Reader Club
              </p>

              <h1 className="mt-4 text-[clamp(2rem,4.3vw,3.4rem)] font-black leading-[1] tracking-[-0.03em] text-slate-900">
                Buat akun baru,
                <span className="block text-primary">mulai perjalanan bacamu.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Daftar sekali untuk menyimpan keranjang, memantau pesanan, dan
                menikmati pengalaman eksplorasi buku yang lebih personal.
              </p>
            </div>

            <form action={formAction} className="mt-6 space-y-5">
              {state.message && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    state.success
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
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
                    className="mb-2 block text-sm font-medium text-slate-700"
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
                    className="mb-2 block text-sm font-medium text-slate-700"
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
                    className="mb-2 block text-sm font-medium text-slate-700"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Memproses" : "Daftar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 lg:text-left">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                Masuk di sini
              </Link>
            </p>

            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_38px_96px_-60px_rgba(15,23,42,0.84)] sm:p-6">
            <article className="relative min-h-[260px] overflow-hidden rounded-[24px]">
              <Image
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1400&h=1100&fit=crop"
                alt="Area baca modern"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />

              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Membership Benefits
                </p>
                <p className="mt-2 text-xl font-semibold leading-tight">
                  Mulai dari daftar, lanjut ke pengalaman belanja yang lebih mulus.
                </p>
              </div>
            </article>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {membershipPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <article
                    key={point.title}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/30">
                      <Icon className="h-4 w-4 text-blue-100" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{point.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      {point.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {confidenceStats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-3"
                >
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>

            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/20"
            >
              Sudah punya akun?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
