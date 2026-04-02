import { BookOpen, Mail, MapPin } from "lucide-react";
import Link from "next/link";

/**
 * Komponen footer yang ditampilkan di bagian bawah setiap halaman publik.
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-7 w-7 text-indigo-400" />
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
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
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
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>info@bookstore.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
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
