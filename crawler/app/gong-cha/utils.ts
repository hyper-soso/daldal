const GONG_CHA_ORIGIN = "https://www.gong-cha.co.kr";

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
 * "열량(kcal)" → "열량", "컵 용량 (ml)" → "컵 용량"
 */
export function nutritionLabel(header: string): string {
  return normalizeText(header.replace(/\([^)]*\)/g, ""));
}

export function headerUnit(header: string): string | null {
  return header.match(/\(\s*(ml|l|g|kg|oz)\s*\)/i)?.[1]?.toLowerCase() ?? null;
}

export function normalizeAllergens(value: string): string | null {
  const text = normalizeText(value)
    .replace(/^\*?\s*알레르기\s*유발물질\s*:?\s*/, "")
    .trim();
  if (!text || text === "-") return null;

  const allergens = [
    ...new Set(
      text
        .split(/\s*[,·/]\s*/)
        .map((allergen) => allergen.trim())
        .filter((allergen) => allergen && allergen !== "-"),
    ),
  ];
  return allergens.length > 0 ? allergens.join(", ") : null;
}

export function toAbsoluteImageUrl(src: string | undefined): string | null {
  if (!src) return null;

  try {
    return new URL(src, GONG_CHA_ORIGIN).toString();
  } catch {
    return null;
  }
}

type TableCell = { text: string; rowSpan: number; colSpan: number };

/**
 * rowspan/colspan이 섞인 영양정보 표를 열 개수가 고정된 격자로 편다.
 */
export function expandTable(
  headerCells: TableCell[],
  bodyRows: TableCell[][],
): { headers: string[]; rows: string[][] } {
  const headers = headerCells.flatMap((cell) =>
    Array.from({ length: cell.colSpan }, () => cell.text),
  );

  const rows: string[][] = [];
  const pending: { text: string; remaining: number }[] = [];

  for (const bodyRow of bodyRows) {
    const row: string[] = [];
    const cells = [...bodyRow];

    for (let column = 0; column < headers.length; column += 1) {
      const carried = pending[column];
      if (carried && carried.remaining > 0) {
        row.push(carried.text);
        carried.remaining -= 1;
        continue;
      }

      const cell = cells.shift();
      if (!cell) {
        row.push("");
        continue;
      }

      for (let span = 0; span < cell.colSpan; span += 1) {
        row[column + span] = cell.text;
        if (cell.rowSpan > 1) {
          pending[column + span] = {
            text: cell.text,
            remaining: cell.rowSpan - 1,
          };
        }
      }
      column += cell.colSpan - 1;
    }

    rows.push(row);
  }

  return { headers, rows };
}
