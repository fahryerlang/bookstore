import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

/**
 * Komponen footer yang ditampilkan di bagian bawah halaman beranda.
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-7 w-7 text-primary-light" />
              <span className="text-xl font-bold text-white">BookStore</span>
            </div>
            <p className="text-sm leading-relaxed">
              Toko buku daring terpercaya dengan koleksi lengkap dari berbagai
              kategori. Temukan buku favoritmu di sini.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary-light transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-light transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-light transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-light" />
                <span>info@bookstore.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-light" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-light" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BookStore. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
