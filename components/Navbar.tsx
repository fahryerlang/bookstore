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
import { useState } from "react";
import { logoutUser } from "@/lib/actions/auth";

/**
 * Props untuk komponen Navbar.
 */
interface NavbarProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

const desktopLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/#katalog", label: "Katalog" },
  { href: "/contact", label: "Kontak" },
];

const mobileLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/#katalog", label: "Katalog" },
  { href: "/contact", label: "Hubungi Kami" },
];

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const elevatedNavClasses = isOpen
    ? "!border-white/12 !bg-dark/94 !shadow-[0_26px_70px_rgba(0,0,0,0.34)]"
    : "";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 pointer-events-none px-9 pt-4 max-md:px-3 max-md:pt-3"
      style={{
        paddingLeft: "clamp(12px, 3vw, 36px)",
        paddingRight: "clamp(12px, 3vw, 36px)",
      }}
    >
      <nav
        className={`pointer-events-auto mx-auto w-full max-w-7xl border backdrop-blur-xl will-change-[border-radius,box-shadow,background-color,border-color] transition-[background-color,border-color,box-shadow] duration-300 ease-out ${elevatedNavClasses}`}
        style={{
          borderRadius: "28px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          backgroundColor: "rgba(26, 26, 26, 0.84)",
          boxShadow: "0 24px 68px rgba(0, 0, 0, 0.30)",
        }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-[height] duration-300 ease-out"
            style={{
              height: "64px",
            }}
          >
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="rounded-xl bg-primary p-1.5 transition-transform duration-300 ease-out">
                  <BookOpen className="h-5 w-5 text-dark" />
                </div>
                <span className="text-lg font-bold text-white tracking-wider uppercase">
                  BookStore
                </span>
              </Link>
            </div>

            {/* Desktop Menu — centered */}
            <div className="hidden md:flex items-center gap-1">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-primary tracking-wide uppercase transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="rounded-2xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-primary uppercase tracking-wide transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/cart"
                    className="rounded-2xl p-2 text-gray-400 hover:bg-white/5 hover:text-primary transition-colors duration-300"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {user.name}
                    </span>
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Keluar"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="rounded-2xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-primary uppercase tracking-wide transition-colors duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-dark hover:bg-primary-dark transition-colors"
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
                aria-expanded={isOpen}
                aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                className="p-2 rounded-xl text-gray-300 hover:text-primary transition-colors"
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
        <div
          className={`grid overflow-hidden border-t transition-[grid-template-rows,opacity,border-color] duration-300 ease-out md:hidden ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 border-white/10"
              : "pointer-events-none grid-rows-[0fr] opacity-0 border-transparent"
          }`}
          style={{
            borderBottomLeftRadius: "28px",
            borderBottomRightRadius: "28px",
          }}
        >
          <div className="overflow-hidden">
            <div className="px-5 py-4 space-y-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-primary font-medium transition-colors uppercase tracking-wide text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-primary font-medium transition-colors uppercase tracking-wide text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-primary font-medium transition-colors uppercase tracking-wide text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Keranjang
                  </Link>
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="w-full text-left px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-colors"
                      >
                        Keluar
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-white/10 flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-white/20 text-gray-300 font-medium hover:bg-white/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center font-bold text-dark hover:bg-primary-dark transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
