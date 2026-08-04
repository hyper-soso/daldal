const COMPOSE_COFFEE_ORIGIN = "https://composecoffee.com";

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

export function splitVariantName(name: string): {
  menuName: string;
  variantName: string | null;
} {
  const match = name.match(/^([HI])\s*-\s*(.+)$/i);

  if (!match) return { menuName: name, variantName: null };

  return {
    menuName: match[2].trim(),
    variantName: match[1].toUpperCase() === "H" ? "HOT" : "ICED",
  };
}

export function toAbsoluteUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value, COMPOSE_COFFEE_ORIGIN).toString();
  } catch {
    return null;
  }
}
