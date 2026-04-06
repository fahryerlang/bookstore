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
    <aside className="hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white/88 backdrop-blur-xl lg:flex">
      <div className="px-7 pb-6 pt-8">
        <BrandLogo href="/" tone="dark" size="sm" showTagline={false} />
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
            User Studio
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-3">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mx-7 h-px bg-gradient-to-r from-cyan-500/35 via-cyan-500/10 to-transparent" />

      <nav className="flex-1 space-y-1 px-5 py-6">
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
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-sky-100 to-cyan-50 text-sky-800 shadow-[inset_0_0_0_1px_rgba(14,116,144,0.15)]"
                  : "text-slate-600 hover:bg-sky-50/75 hover:text-slate-900"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-cyan-500" />
              )}

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-cyan-100 text-cyan-700"
                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-cyan-700"
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
            className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover:bg-red-100">
              <LogOut className="h-[18px] w-[18px]" />
            </div>
            <span className="tracking-wide">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
