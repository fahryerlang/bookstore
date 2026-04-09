"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary"
          aria-label="Halaman sebelumnya"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-slate-400"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
              page === currentPage
                ? "border border-primary bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary"
          aria-label="Halaman berikutnya"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
