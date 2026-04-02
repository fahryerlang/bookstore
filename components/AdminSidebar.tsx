"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  Users,
  ShoppingBag,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

/**
 * Item menu di sidebar admin.
 */
const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategori", icon: FolderOpen },
  { href: "/admin/books", label: "Buku", icon: BookOpen },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/messages", label: "Pesan", icon: MessageSquare },
];

/**
 * Komponen sidebar navigasi untuk area admin.
 */
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-7 w-7 text-indigo-600" />
          <span className="text-lg font-bold text-gray-900">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Toko
          </Link>
        </div>
      </div>
    </aside>
  );
}
