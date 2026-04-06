import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

/**
 * Footer luxury dark + gold style.
 */
export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      {/* Top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-primary">
                <BookOpen className="h-5 w-5 text-dark" />
              </div>
              <span className="text-lg font-bold text-white uppercase tracking-wider">
                BookStore
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Toko buku daring terpercaya dengan koleksi lengkap dari berbagai
              kategori. Temukan buku favoritmu di sini.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-primary font-semibold mb-5 uppercase tracking-[0.2em] text-sm">
              Tautan Cepat
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-primary font-semibold mb-5 uppercase tracking-[0.2em] text-sm">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@bookstore.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BookStore. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
