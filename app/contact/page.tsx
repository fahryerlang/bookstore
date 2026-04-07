"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions/messages";
import {
  Clock3,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "@/components/icons";

const contactChannels = [
  {
    title: "Email Editorial",
    value: "info@erlangmedia.com",
    description: "Untuk pertanyaan umum, kerja sama, dan kebutuhan invoice.",
    icon: Mail,
  },
  {
    title: "Telepon Kantor",
    value: "+62 21 1234 5678",
    description: "Aktif Senin - Jumat, pukul 09.00 - 17.00 WIB.",
    icon: Phone,
  },
  {
    title: "Studio Jakarta",
    value: "Jl. Buku Indah No. 42, Jakarta Pusat",
    description: "Temui tim kami untuk agenda komunitas dan partner.",
    icon: MapPin,
  },
];

const responseNotes = [
  {
    title: "Tulis konteks utama",
    text: "Sebutkan judul buku, alur checkout, atau topik yang sedang Anda bahas agar tim cepat memahami situasi.",
  },
  {
    title: "Fokus pada satu kebutuhan",
    text: "Pisahkan satu pesan untuk satu persoalan utama supaya respons lebih rapi dan mudah ditindaklanjuti.",
  },
  {
    title: "Jelaskan hasil yang diinginkan",
    text: "Beritahu apakah Anda butuh penjelasan, tindak lanjut, rekomendasi, atau konfirmasi tertentu.",
  },
];

const promptPills = [
  "Masalah checkout",
  "Rekomendasi judul",
  "Status pesanan",
  "Kolaborasi komunitas",
];

/**
 * Halaman formulir kontak untuk mengirim pesan ke admin.
 */
export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendMessage, {
    success: false,
    message: "",
  });

  return (
    <div className="space-y-6">
      <section className="editorial-surface-dark relative overflow-hidden rounded-[32px] px-6 py-8 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-16 top-8 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-primary/20 blur-3xl animate-drift-slow" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur-sm">
              Support Desk
            </span>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.8rem)] font-black leading-[0.96] tracking-[-0.04em] text-white">
              Hubungi tim kami dengan nuansa yang lebih hangat dan personal.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Untuk pertanyaan, masukan, kendala checkout, atau diskusi katalog,
              halaman ini kini terasa lebih seperti ruang korespondensi premium
              daripada form standar.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {promptPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <Clock3 className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Balasan lebih rapi</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Pesan masuk dengan struktur visual yang membantu admin membaca konteks lebih cepat.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Nada lebih editorial</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Bahasa visual mengikuti landing page, tetapi dibawa ke arah yang lebih komunikatif.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Pesan langsung tercatat</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Semua komunikasi dikirim lewat akun aktif agar riwayat dan tindak lanjut tetap jelas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="editorial-surface rounded-[28px] p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Support Channels
            </p>

            <div className="mt-4 space-y-3">
              {contactChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <div
                    key={channel.title}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/85 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-[0_18px_35px_-26px_rgba(37,99,235,0.75)]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {channel.title}
                        </p>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {channel.value}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="editorial-surface rounded-[24px] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Before You Send
            </p>

            <div className="mt-4 space-y-3">
              {responseNotes.map((note, index) => (
                <div
                  key={note.title}
                  className="rounded-[22px] border border-slate-200 bg-white/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {note.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="editorial-surface rounded-[28px] p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Message Composer
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                  Kirim pesan ke admin
                </h2>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Semua pesan terkirim lewat akun aktif, sehingga tim dapat melihat konteks
                pengguna dan memberi tindak lanjut yang lebih tepat.
              </p>
            </div>

            <div className="rounded-[22px] border border-primary/15 bg-primary-50 px-4 py-3 text-sm leading-relaxed text-primary-900">
              Subjek yang spesifik mempercepat respons. Contoh: “Checkout gagal setelah isi alamat”.
            </div>
          </div>

          <form action={formAction} className="mt-8 space-y-6">
            {state.message && (
              <div
                className={`rounded-[20px] border px-4 py-3 text-sm ${
                  state.success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {state.message}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {promptPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">
                Subjek
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="editorial-input mt-2 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="Contoh: Butuh bantuan checkout atau ingin rekomendasi buku"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
                Isi Pesan
              </label>
              <textarea
                id="content"
                name="content"
                rows={7}
                required
                className="editorial-input mt-2 min-h-52 resize-none rounded-[24px] px-5 py-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400"
                placeholder="Tuliskan detail pesan Anda, termasuk konteks masalah, judul buku, atau hasil yang Anda harapkan dari tim kami."
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Response Style
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Tim akan merespons dengan konteks yang lebih terstruktur dan jelas.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Catalog Input
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Kritik katalog dan pengalaman UI ikut membantu kami meningkatkan produk.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Admin Ready
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Pesan masuk langsung ke area admin untuk ditinjau tanpa perantara tambahan.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-fit w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
