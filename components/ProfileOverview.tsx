import Link from "next/link";
import type { ComponentType } from "react";
import ProfileEditForm from "@/components/ProfileEditForm";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "@/components/icons";

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

interface ProfileCheckoutDefaults {
  recipientName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  shippingLabel: string;
  shippingMeta: string;
  paymentLabel: string;
  paymentMeta: string;
  orderNotes?: string;
  updatedAt: string;
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
  checkoutDefaults?: ProfileCheckoutDefaults | null;
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
  checkoutDefaults,
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
                  <Mail className="mt-0.5 h-4 w-4 text-blue-100" />
                  <div>
                    <p className="text-sm font-semibold text-white">Email utama</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      Alamat ini dipakai untuk autentikasi dan komunikasi akun Erlangmedia.
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

      <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
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

        <div className="space-y-6">
          <ProfileEditForm initialName={user.name} initialEmail={user.email} />

          <article className="rounded-[26px] border border-primary/10 bg-gradient-to-br from-primary-50 via-white to-slate-50 p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.6)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Default Checkout
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Preferensi checkout terakhir</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Data ini akan menjadi isian awal setiap kali Anda kembali ke halaman checkout.
                </p>
              </div>

              {checkoutDefaults ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                  <Clock3 className="h-4 w-4" />
                  {checkoutDefaults.updatedAt}
                </span>
              ) : null}
            </div>

            {checkoutDefaults ? (
              <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      Kontak utama
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {checkoutDefaults.recipientName}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Penerima utama untuk pesanan Anda.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
                          <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Email
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {checkoutDefaults.contactEmail}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
                          <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Telepon
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {checkoutDefaults.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Kurir default
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {checkoutDefaults.shippingLabel}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {checkoutDefaults.shippingMeta}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Pembayaran default
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {checkoutDefaults.paymentLabel}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {checkoutDefaults.paymentMeta}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Alamat checkout utama
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        Dipakai sebagai isian awal, lalu tetap bisa Anda koreksi sebelum order dibuat.
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {checkoutDefaults.address}
                  </p>

                  {checkoutDefaults.orderNotes ? (
                    <div className="mt-5 rounded-[20px] border border-primary/10 bg-primary-50/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Catatan pengiriman terakhir
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {checkoutDefaults.orderNotes}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-primary/20 bg-white/85 p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Belum ada default checkout yang tersimpan.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Setelah Anda menyelesaikan checkout pertama, alamat, kurir, dan metode pembayaran terakhir akan tampil di sini lalu mengisi form checkout berikutnya secara otomatis.
                </p>
                <Link
                  href="/checkout"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  Siapkan Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
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
        </div>
      </section>
    </div>
  );
}