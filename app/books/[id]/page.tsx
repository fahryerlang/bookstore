import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Truck,
  User,
} from "@/components/icons";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";

/**
 * Props untuk halaman detail buku.
 */
interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

function createExcerpt(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim();
  if (compactText.length <= 210) {
    return compactText;
  }

  return `${compactText.slice(0, 210).trim()}...`;
}

/**
 * Halaman detail buku yang menampilkan informasi lengkap dan tombol beli.
 */
export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const user = await getSession();

  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) notFound();

  const relatedBooks = await prisma.book.findMany({
    where: {
      categoryId: book.categoryId,
      NOT: { id: book.id },
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const backHref = user
    ? user.role === "ADMIN"
      ? "/admin/books"
      : "/dashboard/books"
    : "/#katalog";
  const backLabel = user
    ? user.role === "ADMIN"
      ? "Kembali ke panel buku"
      : "Kembali ke rak buku"
    : "Kembali ke katalog";
  const categoryHref = `/?category=${book.categoryId}`;
  const excerpt = createExcerpt(book.description);

  const detailHighlights = [
    {
      icon: User,
      label: "Penulis",
      value: book.author || "Penulis belum diisi",
      hint: "Informasi penulis membantu kurasi katalog terasa lebih lengkap dan meyakinkan.",
    },
    {
      icon: Tag,
      label: "Kategori",
      value: book.category.name,
      hint: "Kurasi tema yang sama tersusun dalam rak terkait.",
    },
    {
      icon: Package,
      label: "Ketersediaan",
      value: book.stock > 0 ? `${book.stock} unit` : "Stok habis",
      hint:
        book.stock > 0
          ? "Buku siap ditambahkan ke keranjang sekarang juga."
          : "Tunggu restock untuk bisa melanjutkan checkout.",
    },
    {
      icon: Truck,
      label: "Pengiriman",
      value: book.stock > 0 ? "1-3 hari kerja" : "Setelah restock",
      hint: "Estimasi cepat untuk membantu keputusan belanja.",
    },
  ];

  const readingSignals = [
    {
      icon: Sparkles,
      title: "Kurasi lebih terarah",
      text: `Masuk dalam kategori ${book.category.name}, sehingga mudah dipasangkan dengan judul lain yang relevan.`,
    },
    {
      icon: ShieldCheck,
      title: "Informasi pembelian lebih jelas",
      text: "Harga, stok, dan ringkasan pembelian diletakkan dalam satu alur yang cepat dipindai.",
    },
    {
      icon: Star,
      title: "Siap masuk ritme checkout baru",
      text: "Begitu ditambahkan ke keranjang, buku ini bisa langsung mengikuti alur checkout yang sudah diperbarui lebih realistis.",
    },
  ];

  return (
    <>
      <Navbar user={user} />

      <div className="relative flex-1 overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_top,_#edf5ff_0%,_#f8fbff_34%,_#ffffff_72%)]">
        <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-drift-slow" />
        <div className="pointer-events-none absolute -right-20 top-[32rem] h-72 w-72 rounded-full bg-blue-200/25 blur-3xl animate-drift" />

        <main className="relative mx-auto w-full max-w-[min(110rem,calc(100vw-2rem))] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>

            <section className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
              <div className="editorial-surface-dark relative overflow-hidden rounded-[32px] p-4 sm:p-5">
                <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-primary/25 blur-3xl animate-drift" />
                <div className="pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-blue-300/18 blur-3xl animate-drift-slow" />

                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm">
                    {book.category.name}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                          Curated Detail
                        </p>
                        <p className="mt-2 max-w-lg text-lg font-semibold leading-tight text-white">
                          {book.title}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          book.stock > 0
                            ? "border border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                            : "border border-rose-300/20 bg-rose-400/10 text-rose-200"
                        }`}
                      >
                        {book.stock > 0 ? "Ready to cart" : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <section className="editorial-surface rounded-[32px] p-6 sm:p-8 lg:p-9">
                <span className="editorial-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase">
                  Book Detail
                </span>

                <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-3xl">
                    <Link
                      href={categoryHref}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {book.category.name}
                    </Link>
                    <h1 className="mt-4 text-[clamp(2.1rem,5vw,4rem)] font-black leading-[0.96] tracking-[-0.045em] text-slate-900">
                      {book.title}
                    </h1>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {book.author ? `Oleh ${book.author}` : "Penulis belum diisi"}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {excerpt}
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-primary/15 bg-primary-50 px-5 py-4 shadow-[0_24px_60px_-42px_rgba(37,99,235,0.4)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Harga terbaik
                    </p>
                    <p className="mt-2 text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-[-0.05em] text-slate-900">
                      {formatRupiah(book.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    Detail lebih premium
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    Stok {book.stock > 0 ? `${book.stock} unit` : "habis"}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    Checkout siap lanjut
                  </span>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  {detailHighlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.label}
                        className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.22)]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.hint}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
              <div className="space-y-6">
                <article className="editorial-surface rounded-[30px] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Full Description
                      </p>
                      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                        Deskripsi lengkap buku
                      </h2>
                    </div>
                  </div>

                  <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                    {book.description}
                  </p>
                </article>

                <section className="grid gap-4 md:grid-cols-3">
                  {readingSignals.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.title}
                        className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.4)]"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
                      </article>
                    );
                  })}
                </section>
              </div>

              <div className="space-y-6">
                <aside className="editorial-surface sticky top-28 rounded-[30px] p-6 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Purchase Panel
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    Siap masuk ke keranjang
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Panel ini dibuat agar keputusan beli terasa cepat: harga jelas, stok terbaca, dan aksi utama langsung terlihat.
                  </p>

                  <div className="mt-5 rounded-[24px] border border-primary/10 bg-primary-50/80 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-600">Harga buku</span>
                      <span className="text-lg font-black tracking-[-0.03em] text-slate-900">
                        {formatRupiah(book.price)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-600">Ketersediaan</span>
                      <span
                        className={`font-semibold ${
                          book.stock > 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {book.stock > 0 ? `${book.stock} unit siap` : "Stok habis"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <AddToCartButton bookId={book.id} inStock={book.stock > 0} />
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-400">
                    Jika Anda belum login, sistem akan mengarahkan ke halaman masuk sebelum buku ditambahkan ke keranjang.
                  </p>
                </aside>

                <article className="editorial-surface-dark overflow-hidden rounded-[30px] p-6 text-white sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100">
                    Why This Book
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                    Layak masuk rak baca Anda
                  </h2>
                  <div className="mt-6 space-y-3">
                    {readingSignals.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-100">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{item.title}</p>
                              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            </section>

            {relatedBooks.length > 0 ? (
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Related Shelves
                    </p>
                    <h2 className="mt-2 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-900">
                      Judul lain yang masih satu spektrum
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      Kalau kategori ini terasa cocok, Anda bisa lanjut eksplorasi judul lain dengan ritme visual yang sama rapi dan cepat dipindai.
                    </p>
                  </div>

                  <Link
                    href={categoryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                  >
                    Lihat Kategori Ini
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {relatedBooks.map((item) => (
                    <BookCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      author={item.author}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      category={item.category.name}
                      stock={item.stock}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
