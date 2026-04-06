"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  BookOpen,
  Users,
  ShoppingBag,
  MessageSquare,
  LogOut,
} from "@/components/icons";
import BrandLogo from "@/components/BrandLogo";
import { logoutUser } from "@/lib/actions/auth";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/categories", label: "Kategori", icon: FolderOpen },
  { href: "/admin/books", label: "Buku", icon: BookOpen },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/messages", label: "Pesan", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="px-7 pb-6 pt-8">
        <BrandLogo href="/" tone="dark" size="sm" showTagline={false} />
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Admin Panel
          </p>
        </div>
      </div>

      <div className="mx-7 h-px bg-gradient-to-r from-primary/35 via-primary/10 to-transparent" />

      <nav className="flex-1 px-5 py-6 space-y-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.15)]"
                  : "text-slate-600 hover:bg-primary-50/70 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-primary"
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
