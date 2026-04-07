"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/auth";
import { Loader2, Mail, Pencil, ShieldCheck, Sparkles, User } from "@/components/icons";

interface ProfileEditFormProps {
  initialName: string;
  initialEmail: string;
}

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15";

export default function ProfileEditForm({ initialName, initialEmail }: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <article className="rounded-[26px] border border-primary/10 bg-gradient-to-br from-primary-50 via-white to-slate-50 p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.6)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Edit Profil
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Perbarui data akun langsung</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Perubahan nama dan email di sini akan langsung dipakai di ringkasan akun dan checkout berikutnya.
          </p>
        </div>

        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_18px_40px_-28px_rgba(37,99,235,0.55)]">
          <Pencil className="h-5 w-5" />
        </div>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        {state.message ? (
          <div
            className={`rounded-[20px] border px-4 py-3 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-700">
              Nama lengkap
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="profile-name"
                name="name"
                type="text"
                required
                minLength={3}
                defaultValue={initialName}
                className={`${inputClasses} pl-11`}
                placeholder="Nama lengkap Anda"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email utama
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="profile-email"
                name="email"
                type="email"
                required
                defaultValue={initialEmail}
                className={`${inputClasses} pl-11`}
                placeholder="nama@email.com"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Pembaruan aman dan langsung aktif</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Sistem akan mengecek duplikasi email sebelum menyimpan. Data baru akan muncul kembali setelah halaman memuat ulang otomatis.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isPending ? "Menyimpan Profil..." : "Simpan Perubahan Profil"}
        </button>
      </form>
    </article>
  );
}