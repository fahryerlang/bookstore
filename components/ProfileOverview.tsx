import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, Mail, ShieldCheck, User } from "@/components/icons";

type IconComponent = ComponentType<{ className?: string }>;

interface ProfileMetaItem {
  label: string;
  value: string;
}

interface ProfileStat {
  label: string;
  value: number | string;
  hint: string;
  icon: IconComponent;
  tone: string;
}

interface ProfileAction {
  href: string;
  label: string;
  description: string;
  icon: IconComponent;
}

interface ProfileOverviewProps {
  eyebrow: string;
  title: string;
  description: string;
  roleLabel: string;
  roleTone: string;
  avatarTone: string;
  glowTone: string;
  user: {
    name: string;
    email: string;
  };
  summaryTitle: string;
  summaryText: string;
  meta: ProfileMetaItem[];
  stats: ProfileStat[];
  actions: ProfileAction[];
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "BS";
}

export default function ProfileOverview({
  eyebrow,
  title,
  description,
  roleLabel,
  roleTone,
  avatarTone,
  glowTone,
  user,
  summaryTitle,
  summaryText,
  meta,
  stats,
  actions,
}: ProfileOverviewProps) {
  const initials = getInitials(user.name);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_32px_85px_-58px_rgba(15,23,42,0.75)] sm:p-7">
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${glowTone}`}
        />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              {eyebrow}
            </span>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-[22px] border text-2xl font-black tracking-[0.08em] ${avatarTone}`}
              >
                {initials}
              </div>

              <div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${roleTone}`}
                >
                  {roleLabel}
                </span>
                <h1 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-900/10 bg-slate-950 p-5 text-white shadow-[0_20px_50px_-40px_rgba(15,23,42,0.95)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Ringkasan Akun
            </p>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{user.name}</p>
                <p className="mt-1 text-sm text-slate-300">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{summaryTitle}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      {summaryText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-sky-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">Email utama</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      Alamat ini dipakai untuk autentikasi dan komunikasi akun BookStore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-42px_rgba(15,23,42,0.85)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{stat.hint}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.6)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Detail Akun</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Informasi inti akun yang paling sering dibutuhkan.
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            {meta.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.6)]">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Aksi Cepat</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pintasan yang paling sering dipakai agar alur kerja tetap singkat dan fokus.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-[inset_0_0_0_1px_rgba(148,163,184,0.2)] transition group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-900">{action.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}