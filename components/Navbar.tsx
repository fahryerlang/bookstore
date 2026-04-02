"use client";

import Link from "next/link";
import { ShoppingCart, BookOpen, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { logoutUser } from "@/lib/actions/auth";

/**
 * Props untuk komponen Navbar.
 */
interface NavbarProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

/**
 * Komponen navigasi utama aplikasi.
 * Menampilkan menu yang berbeda berdasarkan status login dan peran pengguna.
 */
export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">BookStore</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Hubungi Kami
            </Link>

            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="relative text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  <form action={logoutUser}>
                    <button
                      type="submit"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Keluar"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block text-gray-600 hover:text-indigo-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-indigo-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:text-indigo-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Hubungi Kami
            </Link>
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-gray-600 hover:text-indigo-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Keranjang
                </Link>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="block text-indigo-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
