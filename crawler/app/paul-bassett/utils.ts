const PAUL_BASSETT_ORIGIN = "https://www.baristapaulbassett.co.kr";

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
 * "제공량(ml)360" → 360ml, "제공량(g)250g" → 250g
 */
export function parseServingSize(value: string): {
  size: number | null;
  unit: string | null;
} {
  const text = normalizeText(value);
  const unit = text.match(/\((ml|l|g|kg|oz)\)/i)?.[1]?.toLowerCase() ?? null;

  return { size: parseNumber(text.replace(/^[^)]*\)/, "")), unit };
}

export function normalizeAllergens(value: string): string | null {
  const text = normalizeText(value);
  if (!text) return null;

  const allergens = [
    ...new Set(
      text
        .split(/\s*[,·/]\s*/)
        .map((allergen) => allergen.trim())
        .filter(Boolean),
    ),
  ];
  return allergens.length > 0 ? allergens.join(", ") : null;
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, PAUL_BASSETT_ORIGIN).toString();
  } catch {
    return null;
  }
}
