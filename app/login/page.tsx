"use client";

import { useActionState, useEffect } from "react";
import { loginUser } from "@/lib/actions/auth";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15";

const featureCards = [
  {
    title: "Akses aman",
    description:
      "Data login dikelola dengan alur autentikasi yang aman dan tetap responsif.",
    icon: ShieldCheck,
  },
  {
    title: "Kurasi relevan",
    description:
      "Setelah masuk, kamu bisa lanjut pilih buku sesuai kategori favoritmu.",
    icon: BookOpen,
  },
  {
    title: "Ruang komunitas",
    description:
      "Pantau pesanan, simpan keranjang, dan tetap terhubung dengan update terbaru.",
    icon: Users,
  },
];

const quickStats = [
  { value: "4.9", label: "Reader Rating" },
  { value: "500+", label: "Curated Titles" },
  { value: "24/7", label: "Fast Access" },
];

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
      router.push(state.redirectTo ?? "/dashboard");
      router.refresh();
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_top,_#ecf4ff_0%,_#f7fbff_35%,_#ffffff_72%)] text-slate-900">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-drift-slow" />
      <div className="pointer-events-none absolute -right-20 top-[28rem] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-drift" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8">
          <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_36px_90px_-58px_rgba(15,23,42,0.72)] sm:p-5">
            <div className="relative overflow-hidden rounded-[24px] bg-slate-950 p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -left-12 top-4 h-40 w-40 rounded-full bg-primary/30 blur-3xl animate-drift" />
              <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-blue-300/30 blur-3xl animate-drift-slow" />

              <div className="relative">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>

                <div className="mt-7 flex items-center gap-1.5 text-blue-200">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Member Access
                </p>
                <h1 className="mt-3 text-[clamp(2rem,4.4vw,3.7rem)] font-black leading-[0.98] tracking-[-0.03em] text-white">
                  Masuk dan lanjutkan
                  <span className="block text-blue-200">ritme membaca kamu.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                  Halaman ini disusun agar tetap cepat, jelas, dan senada dengan
                  pengalaman katalog utama tanpa kehilangan fokus pada form login.
                </p>

                <Link
                  href="/register"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-primary-dark"
                >
                  Buat Akun Baru
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-7 grid grid-cols-3 gap-2 sm:max-w-sm">
                  {quickStats.map((stat) => (
                    <article
                      key={stat.label}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                    >
                      <p className="text-base font-bold leading-none text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-slate-300">
                        {stat.label}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {featureCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_82px_-58px_rgba(15,23,42,0.75)] sm:p-8 lg:p-10">
            <div className="mb-8 text-center lg:text-left">
              <BrandLogo href="/" tone="dark" />

              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Secure Login
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl">
                Masuk ke akun Anda
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Gunakan email dan kata sandi untuk melanjutkan ke dashboard,
                keranjang, dan histori pesanan Anda.
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              {state.message && !state.success && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {state.message}
                </div>
              )}

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
                  className={inputClasses}
                  placeholder="Masukkan kata sandi"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Memproses" : "Masuk"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 lg:text-left">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                Daftar sekarang
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
        </div>
      </div>
    </div>
  );
}
