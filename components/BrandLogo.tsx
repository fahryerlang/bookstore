import Link from "next/link";
import { Icon } from "@iconify/react";

interface BrandLogoProps {
  href?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

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
      <span
        className={`inline-flex items-center justify-center rounded-[22px] border ${
          tone === "light"
            ? "border-white/20 bg-white/10"
            : "border-primary/15 bg-primary-50"
        } ${markSizeClass}`}
        aria-hidden="true"
      >
        <Icon
          icon="lucide:library-big"
          className={size === "sm" ? "h-4.5 w-4.5" : size === "lg" ? "h-7 w-7" : "h-5 w-5"}
        />
      </span>

      <span className="leading-none">
        <span className={`block font-bold ${titleClass}`}>Erlangmedia</span>
        {showTagline && (
          <span className={`mt-1 block uppercase tracking-[0.28em] opacity-80 ${subtitleClass}`}>
            DIGITAL READING
          </span>
        )}
      </span>
    </Link>
  );
}
