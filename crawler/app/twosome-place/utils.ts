const TWOSOME_PLACE_IMAGE_ORIGIN = "https://mcdn.twosome.co.kr";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toNullableString(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const normalized = normalizeText(String(value));
  return normalized || null;
}

/**
 * "0/0", "1g미만/1.6", "1,020/51" 처럼 `값/1일 영양성분 기준치 비율` 형태다.
 * 앞쪽 값만 사용한다.
 */
export function parseNutritionValue(value: unknown): number | null {
  const text = toNullableString(value);
  if (!text) return null;

  const match = text.split("/")[0].replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * "(컵용량)355ml" → 355ml, "219g" → 219g, "1개" → 용량 없음
 */
export function parseServingSize(value: unknown): {
  size: number | null;
  unit: string | null;
} {
  const text = toNullableString(value);
  if (!text) return { size: null, unit: null };

  const match = text.replace(/,/g, "").match(/([\d.]+)\s*(ml|l|g|kg|oz)\b/i);
  if (!match) return { size: null, unit: null };

  const parsed = Number(match[1]);
  return {
    size: Number.isFinite(parsed) ? parsed : null,
    unit: match[2].toLowerCase(),
  };
}

/**
 * 메뉴 설명은 HTML 조각으로 내려오고, 화면에 노출되지 않는 주석도 섞여 있다.
 */
export function stripHtml(value: string): string {
  return normalizeText(
    value
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">"),
  );
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

export function toImageUrl(path: unknown): string | null {
  const filePath = toNullableString(path);
  if (!filePath) return null;

  try {
    return new URL(filePath, TWOSOME_PLACE_IMAGE_ORIGIN).toString();
  } catch {
    return null;
  }
}
