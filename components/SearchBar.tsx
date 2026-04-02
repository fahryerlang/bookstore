"use client";

import { Search } from "lucide-react";
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

  /**
   * Menangani pengiriman formulir pencarian.
   */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul buku..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 bg-white shadow-sm"
      />
    </form>
  );
}
