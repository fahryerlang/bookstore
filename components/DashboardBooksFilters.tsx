"use client";

import { Search } from "@/components/icons";
import Link from "next/link";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DashboardBooksFiltersProps {
  categories: Array<{ id: string; name: string }>;
}

function buildBooksHref(q?: string, categoryId?: string) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (categoryId) {
    params.set("category", categoryId);
  }

  const query = params.toString();
  return query ? `/dashboard/books?${query}` : "/dashboard/books";
}

export default function DashboardBooksFilters({ categories }: DashboardBooksFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const activeCategory = searchParams.get("category") ?? "";
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

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [deferredQuery, pathname, searchParams]);

  useEffect(() => {
    const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    if (nextHref === currentHref) {
      return;
    }

    startTransition(() => {
      router.replace(nextHref);
    });
  }, [nextHref, pathname, router, searchParams]);

  return (
    <>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul buku..."
            className="h-11 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <select
          name="category"
          value={activeCategory}
          onChange={(event) => {
            const value = event.target.value;
            startTransition(() => {
              router.replace(buildBooksHref(deferredQuery.trim(), value || undefined));
            });
          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
        >
          <option value="">Semua kategori</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={buildBooksHref(currentQuery || undefined)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            !activeCategory
              ? "border-primary/30 bg-primary-50 text-primary-900"
              : "border-slate-200 bg-white text-slate-600 hover:border-primary/25 hover:text-primary"
          }`}
        >
          Semua
        </Link>
        {categories.map((item) => {
          const active = activeCategory === item.id;

          return (
            <Link
              key={item.id}
              href={buildBooksHref(currentQuery || undefined, item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                active
                  ? "border-primary/30 bg-primary-50 text-primary-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary/25 hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}