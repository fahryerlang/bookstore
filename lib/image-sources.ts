export function isLocalImagePath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

export function isRemoteImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
