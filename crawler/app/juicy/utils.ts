const JUICY_ORIGIN = "http://www.no1juicy.com";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, JUICY_ORIGIN).toString();
  } catch {
    return null;
  }
}
