const PAIKS_COFFEE_ORIGIN = "https://paikdabang.com";

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

export function extractSize(value: string): {
  size: number | null;
  unit: string | null;
} {
  const match = value.match(
    /컵\s*용량\s*:\s*([\d,.]+)\s*(ml|㎖|l|g|kg|oz)?/i,
  );

  return {
    size: parseNumber(match?.[1] ?? ""),
    unit: match?.[2]?.replace("㎖", "ml").toLowerCase() ?? null,
  };
}

export function splitVariantName(name: string): {
  menuName: string;
  variantName: string | null;
} {
  const match = name.match(/^(.*?)\s*\((HOT|ICED)\)\s*$/i);

  return match
    ? { menuName: match[1].trim(), variantName: match[2].toUpperCase() }
    : { menuName: name, variantName: null };
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, PAIKS_COFFEE_ORIGIN).toString();
  } catch {
    return null;
  }
}
