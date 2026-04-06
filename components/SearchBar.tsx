"use client";

import { Search } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Komponen pencarian buku di halaman katalog.
 * Menggunakan query parameter untuk menyimpan teks pencarian.
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const activeCategory = searchParams.get("category");

  /**
   * Menangani pengiriman formulir pencarian.
   */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (activeCategory) {
      params.set("category", activeCategory);
    }

    const target = params.toString();
    router.push(target ? `/?${target}` : "/");
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul buku..."
        className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-24 text-sm tracking-wide text-slate-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-100"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-dark"
      >
        Cari
      </button>
    </form>
  );
}
