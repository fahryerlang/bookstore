import Link from "next/link";
import UserSidebar from "@/components/UserSidebar";
import { Clock, Sparkles, User } from "@/components/icons";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/books", label: "Buku" },
  { href: "/dashboard/orders", label: "Riwayat" },
  { href: "/dashboard/profile", label: "Profil" },
  { href: "/cart", label: "Keranjang" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact", label: "Bantuan" },
];

interface UserPanelShellProps {
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
}

export default function UserPanelShell({ user, children }: UserPanelShellProps) {
  return (
    <div className="flex h-screen gap-4 overflow-hidden bg-grid-soft bg-[radial-gradient(circle_at_top,_#edf5ff_0%,_#f8fbff_32%,_#ffffff_68%)] p-3 sm:p-4">
      <UserSidebar user={user} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto rounded-[32px] border border-white/70 bg-white/58 shadow-[0_38px_95px_-65px_rgba(15,23,42,0.68)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-drift-slow" />
        <div className="pointer-events-none absolute -right-16 top-[22rem] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-drift" />

        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/70 bg-white/78 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                User Workspace
              </p>
              <span className="text-sm font-medium text-slate-700">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/dashboard/books"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Jelajah Buku
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-primary/35 hover:text-primary"
            >
              Keranjang
            </Link>
          </div>

          <Link
            href="/dashboard/profile"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/92 px-3 py-2 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-50/60 hover:shadow-[0_24px_55px_-38px_rgba(15,23,42,0.5)]"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary-50 transition group-hover:border-primary/30 group-hover:bg-primary">
              <User className="h-4 w-4 text-primary transition group-hover:text-white" />
            </div>
          </Link>
        </header>

        <nav className="relative z-20 border-b border-white/70 bg-white/84 px-4 py-3 backdrop-blur lg:hidden sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
