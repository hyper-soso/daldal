const PASCUCCI_ORIGIN = "https://www.pascucci.co.kr";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function parseNumber(value: string): number | null {
  if (!value || value.trim() === "-") return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function splitTemperatureName(
  name: string,
  sourceTemperature: "HOT" | "ICED" | null,
): { menuName: string; temperature: "HOT" | "ICED" | null } {
  if (/^아이스\s+/.test(name)) {
    return {
      menuName: name.replace(/^아이스\s+/, "").trim(),
      temperature: "ICED",
    };
  }

  return { menuName: name, temperature: sourceTemperature };
}

export function parseAllergens(value: string): string | null {
  if (!value || value.trim() === "-") return null;
  const allergens = [
    ...new Set(
      value
        .split(/\s*(?:,|\/|·|\|)\s*/)
        .map((allergen) => allergen.trim())
        .filter(Boolean),
    ),
  ];
  return allergens.length > 0 ? allergens.join(", ") : null;
}

export function toAbsoluteUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value, PASCUCCI_ORIGIN).toString();
  } catch {
    return null;
  }
}
