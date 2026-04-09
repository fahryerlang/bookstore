"use client";

import { Search } from "@/components/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

/**
 * Komponen pencarian buku di halaman katalog.
 * Menggunakan query parameter untuk menyimpan teks pencarian.
 */
export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const activeCategory = searchParams.get("category");
  const [query, setQuery] = useState(currentQuery);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const nextHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = deferredQuery.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    // Reset pagination whenever the active search term changes.
    params.delete("page");

    if (activeCategory) {
      params.set("category", activeCategory);
    }

    const target = params.toString();
    return target ? `${pathname}?${target}` : pathname;
  }, [activeCategory, deferredQuery, pathname, searchParams]);

  useEffect(() => {
    const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (nextHref === currentHref) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        router.replace(nextHref, { scroll: false });
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [nextHref, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul buku..."
        className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-24 text-sm tracking-wide text-slate-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-100"
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
        Live
      </div>
    </div>
  );
}
