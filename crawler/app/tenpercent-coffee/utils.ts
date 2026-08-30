const TENPERCENT_COFFEE_ORIGIN = "https://tenpercentcoffee.com";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, TENPERCENT_COFFEE_ORIGIN).toString();
  } catch {
    return null;
  }
}
