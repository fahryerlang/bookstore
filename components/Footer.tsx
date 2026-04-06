import { Mail, MapPin, Phone } from "@/components/icons";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo href="/" tone="light" className="mb-4" />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Platform toko buku modern dengan kurasi judul pilihan, pengalaman
              belanja cepat, dan pengiriman terpercaya ke seluruh Indonesia.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Tautan Cepat
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-blue-300">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-blue-300">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-blue-300">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Kontak
            </p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-300" />
                <span>info@bookstore.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-300" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-blue-300" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.15em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
            <p>Built for readers who love clarity and speed.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
