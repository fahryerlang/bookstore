import Image from "next/image";
import { isLocalImagePath, isRemoteImageUrl } from "@/lib/image-sources";

interface BookCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function BookCoverImage({
  src,
  alt,
  className,
  fill = false,
  sizes,
  priority = false,
  width,
  height,
}: BookCoverImageProps) {
  const normalizedSrc = src.trim();

  if (isLocalImagePath(normalizedSrc)) {
    if (fill) {
      return (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={className}
        />
      );
    }

    if (typeof width === "number" && typeof height === "number") {
      return (
        <Image
          src={normalizedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={className}
        />
      );
    }
  }

  if (!isRemoteImageUrl(normalizedSrc)) {
    return null;
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={joinClassNames(fill ? "absolute inset-0 h-full w-full" : undefined, className)}
    />
  );
}
