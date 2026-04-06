import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";
import {
  ArrowRight,
  Award,
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Users,
} from "@/components/icons";

const culturePillars = [
  {
    title: "Kurasi yang Bernilai",
    description:
      "Setiap judul dipilih karena dampaknya untuk pembaca, bukan sekadar populer sesaat.",
    icon: Sparkles,
  },
  {
    title: "Komunitas yang Tumbuh",
    description:
      "Kami membangun ruang baca yang ramah agar diskusi buku tetap hidup setiap minggu.",
    icon: Users,
  },
  {
    title: "Kualitas Terjaga",
    description:
      "Bekerja langsung dengan penerbit resmi untuk memastikan buku asli dan kondisi terbaik.",
    icon: Shield,
  },
];

const journeyMilestones = [
  {
    year: "2018",
    title: "Toko pertama dibuka",
    text: "Berawal dari rak kecil di Jakarta dan fokus pada buku nonfiksi pilihan.",
  },
  {
    year: "2021",
    title: "Ekspansi katalog nasional",
    text: "Menambah ratusan judul baru dari berbagai penerbit lokal dan internasional.",
  },
  {
    year: "2024",
    title: "Kurasi berbasis insight",
    text: "Menggabungkan data minat pembaca dan rekomendasi editor untuk hasil yang lebih tepat.",
  },
  {
    year: "2026",
    title: "Ekosistem literasi digital",
    text: "BookStore berkembang sebagai platform bacaan dengan pengalaman belanja yang cepat.",
  },
];

const teamSpotlights = [
  {
    name: "Laila Anindya",
    role: "Head of Curation",
    text: "Menyusun peta tema bacaan agar pembaca bisa naik level tanpa kebingungan.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=900&fit=crop",
  },
  {
    name: "Raka Mahendra",
    role: "Community Strategist",
    text: "Membangun program diskusi mingguan yang membuat rekomendasi buku jadi lebih hidup.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop",
  },
  {
    name: "Dinda Prameswari",
    role: "Experience Designer",
    text: "Merancang alur belanja yang bersih, jelas, dan nyaman dipakai dari mobile sampai desktop.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=900&fit=crop",
  },
];

const impactStats = [
  { label: "Buku Terjual", value: "120K+" },
  { label: "Pembaca Aktif", value: "18K+" },
  { label: "Sesi Diskusi", value: "2.4K+" },
  { label: "Penerbit Mitra", value: "160+" },
];

export default async function AboutPage() {
  const user = await getSession();
  const primaryCtaHref = user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : "/#katalog";
  const primaryCtaLabel = user ? "Buka Dashboard" : "Jelajahi Katalog";
  const nextChapterDescription = user
    ? "Lanjutkan aktivitas akunmu dari dashboard untuk memantau pesanan, keranjang, dan update terbaru."
    : "Kembali ke katalog utama dan temukan judul yang paling pas untuk target belajar, karier, dan pengembangan diri kamu.";

  return (
    <>
      <Navbar user={user} />

      <div className="relative flex-1 overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_top,_#ecf4ff_0%,_#f6faff_34%,_#ffffff_70%)]">
        <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-drift-slow" />
        <div className="pointer-events-none absolute -right-20 top-[40rem] h-72 w-72 rounded-full bg-blue-200/25 blur-3xl animate-drift" />

        <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_36px_90px_-58px_rgba(15,23,42,0.75)] sm:p-5">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative overflow-hidden rounded-[24px] bg-slate-950 p-7 text-white sm:p-10">
                <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-primary/30 blur-3xl animate-drift" />
                <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-sky-300/25 blur-3xl animate-drift-slow" />

                <div className="relative">
                  <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                    About BookStore
                  </p>
                  <h1 className="mt-6 text-[clamp(2rem,4.6vw,4rem)] font-black leading-[0.97] tracking-[-0.03em]">
                    Membangun Kultur
                    <span className="block text-blue-200">Membaca yang Relevan.</span>
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                    Kami percaya buku terbaik adalah buku yang datang di waktu yang
                    tepat. Karena itu, tim kami fokus pada kurasi tajam, komunitas
                    aktif, dan pengalaman belanja yang tetap ringan.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={primaryCtaHref}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-primary-dark"
                    >
                      {primaryCtaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                    >
                      Hubungi Kami
                    </Link>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
                    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm">
                      <p className="text-lg font-bold leading-none">8+</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                        Years Journey
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm">
                      <p className="text-lg font-bold leading-none">500+</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                        Curated Titles
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm">
                      <p className="text-lg font-bold leading-none">4.9</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                        Reader Rating
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-5">
                <article className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&h=1200&fit=crop"
                    alt="Tumpukan buku dan area baca"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/35 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                      Reading Atmosphere
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-tight">
                      Menghubungkan pembaca dengan bacaan yang benar-benar berdampak.
                    </p>
                  </div>
                </article>

                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Catalog Precision
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      Kategori disusun agar pencarian judul lebih cepat dan terarah.
                    </p>
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <Award className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Trusted by Readers
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      Dibangun dari feedback komunitas agar kualitas selalu meningkat.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
                Storyline
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,4.3vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                Dari Rak Kecil Menjadi
                <br />
                Ruang Literasi Modern
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Perjalanan kami dimulai dari toko sederhana dan berkembang lewat
                komitmen pada kurasi, pelayanan, serta pengalaman pengguna yang rapi.
              </p>
            </div>

            <div className="space-y-3">
              {journeyMilestones.map((milestone) => (
                <article
                  key={milestone.year}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_42px_-38px_rgba(15,23,42,0.75)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {milestone.year}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {milestone.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {milestone.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="nilai"
            className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Core Values
              </p>
              <h2 className="mt-2 text-[clamp(1.9rem,4.3vw,3.1rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                Nilai yang Menjadi Arah Tim Kami
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {culturePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      {pillar.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-14 rounded-3xl bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Team Spotlight
                </p>
                <h2 className="mt-3 text-[clamp(1.9rem,4.2vw,3rem)] font-black leading-[1.02] tracking-[-0.03em]">
                  Orang di Balik Kurasi BookStore
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Kami adalah tim lintas disiplin yang sama-sama percaya bahwa buku
                  yang tepat bisa mengubah keputusan, karier, dan cara hidup.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {impactStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-300">
                      {stat.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {teamSpotlights.map((member) => (
                <article
                  key={member.name}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  <div className="relative aspect-[4/3] bg-slate-700">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-blue-200">
                      {member.role}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {member.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-blue-100 bg-gradient-to-br from-primary-50 via-white to-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Next Chapter
                </p>
                <h2 className="mt-2 text-[clamp(1.9rem,4.1vw,2.9rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                  Siap Menemukan Bacaan Berikutnya?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {nextChapterDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-primary-dark"
                >
                  {user ? "Buka Dashboard" : "Buka Katalog"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  Konsultasi Tim
                  <Heart className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
