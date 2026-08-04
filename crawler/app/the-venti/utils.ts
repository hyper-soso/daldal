const THE_VENTI_ORIGIN = "https://www.theventi.co.kr";

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

export function splitMenuName(name: string): {
  menuName: string;
  temperature: "HOT" | "ICED" | null;
} {
  let menuName = name.replace(
    /\s*\((?:미디엄|라지|점보)(?:\s*\/\s*(?:미디엄|라지|점보))*\)\s*$/,
    "",
  );
  let temperature: "HOT" | "ICED" | null = null;

  if (/^핫\s+/.test(menuName)) {
    menuName = menuName.replace(/^핫\s+/, "");
    temperature = "HOT";
  } else if (/^아이스\s+/.test(menuName)) {
    menuName = menuName.replace(/^아이스\s+/, "");
    temperature = "ICED";
  }

  return { menuName: menuName.trim(), temperature };
}

export function extractTemperature(
  description: string,
): "HOT" | "ICED" | null {
  const match = description.match(/(?:핫|아이스)\s*\((HOT|ICED)\)\s*기준/i);
  return match ? (match[1].toUpperCase() as "HOT" | "ICED") : null;
}

export function extractSize(
  value: string,
  description: string,
): { size: number | null; unit: string | null; label: string | null } {
  const basisLabel = description.match(
    /(미디엄|라지|점보)\s*\([^)]*\)\s*사이즈\s*(?:핫|아이스)/,
  )?.[1];
  const matches = [
    ...value.matchAll(
      /([가-힣A-Za-z0-9]+)?\s*\(\s*([\d,.]+)\s*(ml|g|kg|oz)\s*\)/gi,
    ),
  ];
  const selected =
    matches.find((match) => basisLabel && match[1] === basisLabel) ??
    matches[0];

  if (selected) {
    return {
      size: parseNumber(selected[2]),
      unit: selected[3].toLowerCase(),
      label: selected[1] ?? null,
    };
  }

  const plain = value.match(/([\d,.]+)\s*(ml|g|kg|oz)/i);
  return {
    size: parseNumber(plain?.[1] ?? ""),
    unit: plain?.[2]?.toLowerCase() ?? null,
    label: null,
  };
}

export function toAbsoluteUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value, THE_VENTI_ORIGIN);
    if (url.hostname.endsWith("theventi.co.kr")) url.protocol = "https:";
    return url.toString();
  } catch {
    return null;
  }
}
