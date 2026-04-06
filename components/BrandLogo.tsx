import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

/**
 * Logo brand bergaya monogram + tipografi.
 * Terinspirasi referensi: mark geometris, judul tebal, dan subtitle uppercase.
 */
export default function BrandLogo({
  href = "/",
  tone = "light",
  size = "md",
  showTagline = true,
  className = "",
}: BrandLogoProps) {
  const toneClass = tone === "light" ? "text-white" : "text-gray-900";

  const markSizeClass =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10";

  const titleClass =
    size === "sm"
      ? "text-base tracking-[0.12em]"
      : size === "lg"
      ? "text-2xl tracking-[0.15em]"
      : "text-lg tracking-[0.13em]";

  const subtitleClass = size === "sm" ? "text-[8px]" : "text-[9px]";

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${toneClass} ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className={markSizeClass}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M17 6L34 15V26L22 32V56L12 50V12L17 9L29 16V20L17 27"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M22 21L44 32L36 36L14 25L22 21Z" fill="currentColor" />
        <path d="M22 33L44 44L36 48L14 37L22 33Z" fill="currentColor" />
        <path d="M22 45L44 56L36 60L14 49L22 45Z" fill="currentColor" />
      </svg>

      <span className="leading-none">
        <span className={`block font-bold uppercase ${titleClass}`}>EBOOK</span>
        {showTagline && (
          <span className={`mt-1 block uppercase tracking-[0.28em] opacity-80 ${subtitleClass}`}>
            MOBILE APP
          </span>
        )}
      </span>
    </Link>
  );
}
