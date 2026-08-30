const SULBING_ORIGIN = "https://sulbing.com";

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
 * "열량(Kcal) 250 | 당류(g) 30 | 나트륨(mg) 85" 형태의 한 줄을 성분별로 나눈다.
 * 값이 비어 있는 성분은 담지 않는다.
 */
export function parseNutrition(value: string): Map<string, number> {
  const nutrition = new Map<string, number>();

  for (const part of normalizeText(value).split("|")) {
    const match = part.match(/^\s*([^()]+)\([^)]*\)\s*(.*)$/);
    if (!match) continue;

    const parsed = parseNumber(match[2]);
    if (parsed === null) continue;

    nutrition.set(normalizeText(match[1]), parsed);
  }

  return nutrition;
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
    return new URL(src, SULBING_ORIGIN).toString();
  } catch {
    return null;
  }
}
