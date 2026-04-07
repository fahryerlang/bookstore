import {
  ArrowRight,
  BookOpen,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "@/components/icons";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/#katalog", label: "Katalog Pilihan" },
  { href: "/contact", label: "Hubungi Tim" },
];

const contactItems = [
  {
    icon: Mail,
    label: "Email editorial",
    value: "info@erlangmedia.com",
  },
  {
    icon: Phone,
    label: "Telepon studio",
    value: "+62 812 3456 7890",
  },
  {
    icon: MapPin,
    label: "Basis operasional",
    value: "Jakarta, Indonesia",
  },
];

const brandSignals = [
  {
    icon: Sparkles,
    title: "Kurasi editorial",
    text: "Judul dipilih karena relevansi, bukan sekadar ramai sesaat.",
  },
  {
    icon: BookOpen,
    title: "Jalur beli lebih singkat",
    text: "Dari katalog ke checkout dibangun supaya ritmenya tetap ringan.",
  },
  {
    icon: ShieldCheck,
    title: "Layanan yang jelas",
    text: "Informasi pesanan, kontak, dan bantuan dibuat mudah ditemukan.",
  },
];

const footerHighlights = [
  { value: "500+", label: "Judul kurasi" },
  { value: "24/7", label: "Akses katalog" },
  { value: "4.9", label: "Kepuasan pembaca" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden text-slate-200">
      <div className="mx-auto w-full max-w-[min(110rem,calc(100vw-2rem))] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.95)_44%,rgba(30,58,138,0.92)_100%)] shadow-[0_42px_120px_-78px_rgba(15,23,42,0.95)]">
          <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-primary/18 blur-3xl animate-drift" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-blue-300/16 blur-3xl animate-drift-slow" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />

          <div className="relative border-b border-white/10 px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100 backdrop-blur-sm">
                  Closing Chapter
                </span>
                <h2 className="mt-5 max-w-3xl text-[clamp(1.9rem,4vw,3.5rem)] font-black leading-[0.96] tracking-[-0.04em] text-white">
                  Penutup yang lebih hidup untuk pengalaman membaca yang terasa matang.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                  Erlangmedia menutup landing page dengan bahasa visual yang tetap kuat: gelap, rapi, editorial, dan jelas mengarahkan pembaca ke langkah berikutnya.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/#katalog"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-blue-100"
                  >
                    Jelajahi Katalog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/18"
                  >
                    Bicara Dengan Tim
                    <Heart className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {footerHighlights.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[1.65rem] font-black leading-none tracking-[-0.04em] text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                      {item.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="relative px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.55fr_0.8fr_0.95fr]">
              <div>
                <BrandLogo href="/" tone="light" className="mb-4" />
                <p className="max-w-md text-sm leading-relaxed text-slate-300">
                  Ruang baca digital yang menggabungkan kurasi tajam, ritme belanja yang efisien, dan identitas visual yang terasa premium dari hero sampai footer.
                </p>

                <div className="mt-6 grid gap-3">
                  {brandSignals.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[22px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-100">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-300">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Navigasi
                </p>
                <ul className="space-y-2.5 text-sm">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Kontak
                </p>
                <div className="space-y-3">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[22px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-100">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                  Reader Signal
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  Dibuat untuk pembaca yang suka kejelasan, ritme cepat, dan kurasi yang terasa personal.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Footer ini tidak hanya menutup halaman, tetapi juga mempertegas arah brand dan memberi jalur singkat ke katalog maupun kanal bantuan.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                    Visual editorial
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                    Checkout cepat
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                    Support manusia
                  </span>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  <Users className="h-4 w-4" />
                  Built for focused readers
                </div>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 px-6 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.15em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; {new Date().getFullYear()} Erlangmedia. All rights reserved.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <p>Reading, curated with clarity.</p>
                <Link href="#" className="text-blue-100 transition hover:text-white">
                  Kembali ke atas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
