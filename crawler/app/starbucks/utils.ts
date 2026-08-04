const STARBUCKS_ORIGIN = "https://www.starbucks.co.kr";

const OUNCE_SIZES = new Map<number, { name: string; ml: number }>([
  [0.75, { name: "SOLO", ml: 22 }],
  [1.5, { name: "DOPPIO", ml: 44 }],
  [7, { name: "기본", ml: 207 }],
  [8, { name: "SHORT", ml: 237 }],
  [10, { name: "기본", ml: 296 }],
  [12, { name: "TALL", ml: 355 }],
  [16, { name: "GRANDE", ml: 473 }],
  [20, { name: "VENTI", ml: 591 }],
  [30, { name: "TRENTA", ml: 887 }],
]);

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toNullableString(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const normalized = normalizeText(String(value));
  return normalized || null;
}

export function toNullableNumber(value: unknown): number | null {
  const normalized = toNullableString(value)?.replace(/,/g, "");
  if (!normalized) return null;

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function splitTemperatureName(
  name: string,
  hotYn: string | null,
  isDrink: boolean,
): { menuName: string; temperature: "HOT" | "ICED" | null } {
  if (!isDrink) return { menuName: name, temperature: null };

  if (/^아이스\s+/.test(name)) {
    return { menuName: name.replace(/^아이스\s+/, ""), temperature: "ICED" };
  }

  return {
    menuName: name,
    temperature: hotYn === "Y" ? "HOT" : hotYn === "N" ? "ICED" : null,
  };
}

export function parseSize(
  standardValue: unknown,
  unitValue: unknown,
): { name: string; size: number | null; unit: string | null } {
  const standard = toNullableNumber(standardValue);
  const unit = toNullableString(unitValue)?.toLowerCase() ?? null;

  if (standard === null || standard <= 0) {
    return { name: "기본", size: null, unit: null };
  }

  if (unit?.startsWith("oz")) {
    const mapped = OUNCE_SIZES.get(standard);
    return mapped
      ? { name: mapped.name, size: mapped.ml, unit: "ml" }
      : { name: `${standard}oz`, size: standard, unit: "oz" };
  }

  return {
    name: `${standard}${unit ?? ""}`,
    size: standard,
    unit,
  };
}

export function normalizeAllergens(value: unknown): string | null {
  const text = toNullableString(value)
    ?.replace(/^알레르기\s*유발요인\s*:\s*/, "")
    .trim();
  if (!text) return null;

  const allergens = [
    ...new Set(
      text
        .split(/\s*(?:\/|,|@|·|\|)\s*/)
        .map((allergen) => allergen.trim())
        .filter(Boolean),
    ),
  ];
  return allergens.length > 0 ? allergens.join(", ") : null;
}

export function toImageUrl(base: unknown, path: unknown): string | null {
  const filePath = toNullableString(path);
  if (!filePath) return null;

  try {
    const url = new URL(filePath, toNullableString(base) ?? STARBUCKS_ORIGIN);
    if (url.hostname === "www.istarbucks.co.kr") {
      url.hostname = "image.istarbucks.co.kr";
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function extractJsonObject(
  source: string,
  marker: string,
): string | null {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return null;

  const startIndex = source.indexOf("{", markerIndex + marker.length);
  if (startIndex < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) {
      return source.slice(startIndex, index + 1);
    }
  }

  return null;
}
