"use client";

import Link from "next/link";
import {
  ShoppingCart,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { logoutUser } from "@/lib/actions/auth";

/**
 * Props untuk komponen Navbar.
 */
interface NavbarProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

/**
 * Floating navbar dengan efek glassmorphism.
 * Transparan di atas hero, menjadi solid saat scroll.
 */
export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <nav
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="px-5 sm:px-6">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 transition-colors duration-300">
                  BookStore
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/", label: "Beranda" },
                { href: "/about", label: "Tentang" },
                { href: "/contact", label: "Kontak" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 transition-all duration-300"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-primary-50 transition-all duration-300 ml-1"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <div
                    className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Keluar"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-50 transition-all duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
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
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl rounded-b-2xl">
            <div className="px-5 py-4 space-y-1">
              {[
                { href: "/", label: "Beranda" },
                { href: "/about", label: "Tentang Kami" },
                { href: "/contact", label: "Hubungi Kami" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="block px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Keranjang
                  </Link>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="w-full text-left px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors"
                      >
                        Keluar
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-gray-100 flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
