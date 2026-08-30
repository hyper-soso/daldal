import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { BANAPRESSO_CATEGORIES } from "./cafe";
import { type CrawledMenu, type BanapressoCrawlResult } from "./types";
import {
  ingredientLabel,
  normalizeAllergens,
  toImageUrl,
  toNullableNumber,
  toNullableString,
  toRecords,
} from "./utils";

const QUERY_URL = "https://order.banapresso.com/query";
const FRANCHISE_CODE = 200000;
const MENU_LIST_QUERY = "91D8843AB9D3C73B28F1043252C574AF";
const MENU_NUTRITION_QUERY = "84ECEACF7A6020B87C9C7B1CDCC7C803";
const REQUEST_DELAY_MS = 80;

type BanapressoRow = Record<string, unknown>;

/** 온도 구분: 1 HOT, 2 ICED, 3 HOT + ICED, 0 없음 */
const TEMPERATURES: Record<number, ("HOT" | "ICED")[]> = {
  0: [],
  1: ["HOT"],
  2: ["ICED"],
  3: ["HOT", "ICED"],
};

function isRecord(value: unknown): value is BanapressoRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function query(
  name: string,
  params: Record<string, unknown>,
  context: string,
): Promise<BanapressoRow[]> {
  const response = await fetch(QUERY_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)",
      Referer: "https://order.banapresso.com/menu",
    },
    body: JSON.stringify({ ws: "fprocess", query: name, params }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Banapresso ${context}: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  if (!isRecord(data) || !Array.isArray(data.rows) || !Array.isArray(data.columns)) {
    throw new Error(`Banapresso ${context} returned invalid JSON`);
  }

  return toRecords(
    data.columns.filter(isRecord).map((column) => ({
      name: String(column.name),
    })),
    data.rows as unknown[][],
  );
}

function createVariants(
  menuId: string,
  temperatures: ("HOT" | "ICED")[],
  nutritionRows: BanapressoRow[],
): NewMenuVariant[] {
  const names = temperatures.length > 0 ? temperatures : ["기본"];

  return names.map((name, sortOrder) => {
    const hot = name !== "ICED";
    const first = nutritionRows[0];
    const valueOf = (label: string): number | null => {
      const row = nutritionRows.find(
        (item) => ingredientLabel(item.sIngredient) === label,
      );
      if (!row) return null;

      return toNullableNumber(hot ? row.fContentHot : row.fContentIce);
    };

    return {
      menuId,
      name,
      size: null,
      unit: null,
      price: null,
      calories: first
        ? toNullableNumber(hot ? first.nKCalHot : first.nKCalIce)
        : null,
      fat: valueOf("지방"),
      saturatedFat: valueOf("포화지방"),
      sugars: valueOf("당류"),
      sodium: valueOf("나트륨"),
      protein: valueOf("단백질"),
      caffeine: valueOf("카페인"),
      carbohydrate: valueOf("탄수화물"),
      isDefault: sortOrder === 0,
      sortOrder,
    } satisfies NewMenuVariant;
  });
}

export async function crawlBanapressoMenus(): Promise<BanapressoCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  console.log("[banapresso] menu list");
  const rows = await query(
    MENU_LIST_QUERY,
    { f_code: FRANCHISE_CODE, f_code_sub: 0 },
    "menu list",
  );
  if (rows.length === 0) {
    throw new Error("Banapresso returned no menu list");
  }

  for (const category of BANAPRESSO_CATEGORIES) {
    const categoryRows = rows.filter(
      (row) =>
        toNullableString(row.sItemDivision) === category.division &&
        toNullableString(row.bDelete) !== "1" &&
        toNullableNumber(row.is_not_view) !== 1,
    );

    if (categoryRows.length === 0) {
      throw new Error(
        `Banapresso category ${category.id} returned no menu data`,
      );
    }

    console.log(`[banapresso] ${category.id} (${categoryRows.length})`);

    let sortOrder = 0;
    for (const row of categoryRows) {
      const menuItem = toNullableNumber(row.nItem);
      const name = toNullableString(row.sItem);
      if (menuItem === null || !name) continue;

      await sleep(REQUEST_DELAY_MS);
      const nutritionRows = await query(
        MENU_NUTRITION_QUERY,
        { f_code: FRANCHISE_CODE, menu_item: menuItem },
        `menu ${menuItem} nutrition`,
      );

      const menuId = randomUUID();
      menus.push({
        id: menuId,
        categoryId: category.id,
        name,
        description:
          toNullableString(row.sMenuExplanation) ??
          toNullableString(row.sEItem),
        imageUrl:
          toImageUrl(row.sImageUrl) ?? toImageUrl(row.sImageUrlSub),
        allergens: normalizeAllergens(nutritionRows[0]?.sAllergy),
        isAvailable: toNullableString(row.bTodayNotSale) !== "1",
        sortOrder,
      });
      variants.push(
        ...createVariants(
          menuId,
          TEMPERATURES[toNullableNumber(row.nIceItemType) ?? 0] ?? [],
          nutritionRows,
        ),
      );
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
