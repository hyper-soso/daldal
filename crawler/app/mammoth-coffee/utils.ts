const MAMMOTH_COFFEE_ORIGIN = "https://www.mmthcoffee.com";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function parseNumber(value: string): number | null {
  if (!value) return null;

  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * "HOT(16oz)" → 이름 HOT, 용량 16oz
 */
export function parseVariantHeader(header: string): {
  name: string;
  size: number | null;
  unit: string | null;
} {
  const text = normalizeText(header);
  const size = text.match(/([\d,.]+)\s*(ml|l|g|kg|oz)/i);

  return {
    name: normalizeText(text.replace(/\([^)]*\)/g, "")) || text,
    size: size ? parseNumber(size[1]) : null,
    unit: size ? size[2].toLowerCase() : null,
  };
}

/**
 * "칼로리 (Kcal)" → "칼로리"
 */
export function nutritionLabel(value: string): string {
  return normalizeText(value.replace(/\([^)]*\)/g, ""));
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, MAMMOTH_COFFEE_ORIGIN).toString();
  } catch {
    return null;
  }
}
