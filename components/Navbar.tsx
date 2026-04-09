"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Menu, X } from "@/components/icons";
import { useState } from "react";
import { logoutUser } from "@/lib/actions/auth";
import BrandLogo from "@/components/BrandLogo";
import NotificationBell from "@/components/NotificationBell";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NavbarProps {
  user: { id: string; name: string; email: string; role: string } | null;
  notifications?: NotificationItem[];
  unreadNotificationCount?: number;
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

export default function Navbar({ user, notifications = [], unreadNotificationCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleDesktopLinks = user
    ? desktopLinks.filter((link) => link.href !== "/#katalog")
    : desktopLinks;
  const visibleMobileLinks = user
    ? mobileLinks.filter((link) => link.href !== "/#katalog")
    : mobileLinks;
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const profileHref = user?.role === "ADMIN" ? "/admin/profile" : "/profile";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto w-full max-w-[min(110rem,calc(100vw-2rem))] rounded-2xl border border-slate-200/90 bg-white/90 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.8)] backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <BrandLogo href="/" tone="dark" size="sm" />

          <div className="hidden items-center gap-1 md:flex">
            {visibleDesktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-primary-50 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                >
                  Dashboard
                </Link>

                <Link
                  href="/cart"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
                  aria-label="Keranjang"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>

                {user.role !== "ADMIN" && (
                  <NotificationBell
                    notifications={notifications}
                    unreadCount={unreadNotificationCount}
                  />
                )}

                <div className="ml-1 flex items-center gap-2">
                  <Link
                    href={profileHref}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:border-primary/30 hover:bg-primary-50"
                    aria-label="Buka profil"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="max-w-[130px] truncate text-sm font-semibold text-slate-700">
                      {user.name}
                    </span>
                  </Link>
                  <form action={logoutUser}>
                    <button
                      type="submit"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="Keluar"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 md:hidden ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden border-t border-slate-200">
            <div className="space-y-1 px-4 py-4">
              {visibleMobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={profileHref}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/cart"
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Keranjang
                  </Link>
                  <form action={logoutUser} className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-red-100 px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-[0.13em] text-red-600 transition hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/login"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:border-primary hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-primary-dark"
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
