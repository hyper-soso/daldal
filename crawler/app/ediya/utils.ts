const EDIYA_ORIGIN = "https://www.ediya.com";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function parseNumber(value: string): number | null {
  if (!value) return null;

  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function extractUnit(value: string): string | null {
  return value.match(/[a-zA-Z]+/)?.[0]?.toLowerCase() ?? null;
}

export function toAbsoluteImageUrl(
  src: string | undefined,
): string | null {
  if (!src) return null;

  try {
    return new URL(src, EDIYA_ORIGIN).toString();
  } catch {
    return null;
  }
}

export function splitVariantName(name: string): {
  menuName: string;
  variantName: string | null;
} {
  const match = name.match(/^\(([^)]+)\)\s*(.+)$/);

  return match
    ? { menuName: match[2].trim(), variantName: match[1].trim() }
    : { menuName: name, variantName: null };
}
