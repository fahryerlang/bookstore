"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  User,
} from "@/components/icons";
import { logoutUser } from "@/lib/actions/auth";

interface UserSidebarProps {
  user: {
    name: string;
    email: string;
  };
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/books", label: "Katalog Buku", icon: BookOpen },
  { href: "/dashboard/orders", label: "Riwayat Belanja", icon: ShoppingBag },
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  { href: "/checkout", label: "Checkout", icon: CreditCard },
  { href: "/contact", label: "Bantuan", icon: MessageSquare },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="relative isolate hidden h-full w-[290px] shrink-0 overflow-hidden rounded-[32px] border border-white/70 bg-white/82 shadow-[0_38px_90px_-58px_rgba(15,23,42,0.68)] backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-8 h-48 w-48 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative z-10 px-7 pb-6 pt-8">
        <BrandLogo href="/" tone="dark" size="sm" showTagline={false} />
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            User Studio
          </p>
        </div>

        <div className="mt-5 rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4 shadow-[0_20px_45px_-40px_rgba(37,99,235,0.45)]">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="relative z-10 mx-7 h-px bg-gradient-to-r from-primary/35 via-primary/10 to-transparent" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-5 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            User Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-primary-100 via-primary-50 to-white text-primary shadow-[0_18px_38px_-30px_rgba(37,99,235,0.42)]"
                    : "text-slate-600 hover:bg-white/90 hover:text-slate-900 hover:shadow-[0_18px_32px_-32px_rgba(15,23,42,0.35)]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                )}

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    active
                      ? "bg-white text-primary shadow-sm"
                      : "bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>

                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-5 pb-6">
          <div className="mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <form action={logoutUser}>
            <button
              type="submit"
              className="group flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-white/90 px-4 py-3.5 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100">
                <LogOut className="h-[18px] w-[18px]" />
              </div>
              <span className="tracking-wide">Logout</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
