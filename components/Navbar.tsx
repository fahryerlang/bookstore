import Link from "next/link";
import { ShoppingCart, User, LogOut, Menu } from "@/components/icons";
import { logoutUser } from "@/lib/actions/auth";
import BrandLogo from "@/components/BrandLogo";
import DeferredNotificationBell from "@/components/DeferredNotificationBell";

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
      <nav className="mx-auto w-full max-w-[min(110rem,calc(100vw-2rem))] rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.8)]">
        <div className="hidden h-16 items-center justify-between px-4 sm:px-6 md:flex">
          <BrandLogo href="/" tone="dark" size="sm" />

          <div className="flex items-center gap-1">
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

          <div className="flex items-center gap-2">
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

                {user.role !== "ADMIN" && <DeferredNotificationBell />}

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
        </div>

        <details className="md:hidden">
          <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-4 text-slate-600 sm:px-6 [&::-webkit-details-marker]:hidden">
            <BrandLogo href="/" tone="dark" size="sm" />
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition hover:border-primary hover:text-primary">
              <Menu className="h-5 w-5" />
            </span>
          </summary>

          <div className="border-t border-slate-200">
            <div className="space-y-1 px-4 py-4">
              {visibleMobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={profileHref}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/cart"
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-slate-700 transition hover:bg-primary-50 hover:text-primary"
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
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-primary-dark"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
