export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toNullableString(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const normalized = normalizeText(String(value));
  return normalized || null;
}

export function toNullableNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const text = toNullableString(value)?.replace(/,/g, "");
  if (!text) return null;

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * "나트륨 mg" → "나트륨"
 */
export function ingredientLabel(value: unknown): string | null {
  const text = toNullableString(value);
  if (!text) return null;

  return normalizeText(text.replace(/\s*(mg|g|kcal)\s*$/i, ""));
}

export function normalizeAllergens(value: unknown): string | null {
  const text = toNullableString(value);
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

export function toImageUrl(value: unknown): string | null {
  const src = toNullableString(value);
  if (!src) return null;

  try {
    return new URL(src).toString();
  } catch {
    return null;
  }
}

/**
 * 주문 API는 `columns`(열 정의)와 `rows`(값 배열)를 따로 내려준다.
 */
export function toRecords(
  columns: { name: string }[],
  rows: unknown[][],
): Record<string, unknown>[] {
  return rows.map((row) =>
    Object.fromEntries(columns.map((column, index) => [column.name, row[index]])),
  );
}
