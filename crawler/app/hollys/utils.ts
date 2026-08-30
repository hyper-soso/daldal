const HOLLYS_ORIGIN = "https://www.hollys.co.kr";

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

export function normalizeNutritionLabel(label: string): string {
  return normalizeText(label).replace(/\([^)]*\)/g, "").trim();
}

/**
 * "제품영양정보 (1회 제공량 / Regular / 354ml 기준 ( Grande / 472ml ))" → 354ml
 * "제품영양정보 (총 중량 91g, 1회 제공량 91g)" → 91g
 */
export function parseServingSize(value: string): {
  size: number | null;
  unit: string | null;
} {
  const match = normalizeText(value).match(/([\d,.]+)\s*(ml|l|g|kg|oz)\b/i);
  if (!match) return { size: null, unit: null };

  return { size: parseNumber(match[1]), unit: match[2].toLowerCase() };
}

export function normalizeAllergens(value: string): string | null {
  const text = normalizeText(value)
    .replace(/^알레르기\s*유발요인\s*:?\s*/, "")
    .trim();
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
    return new URL(src, HOLLYS_ORIGIN).toString();
  } catch {
    return null;
  }
}
