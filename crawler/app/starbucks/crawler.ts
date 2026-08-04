import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { STARBUCKS_CATEGORIES, type StarbucksCategory } from "./cafe";
import { type CrawledMenu, type StarbucksCrawlResult } from "./types";
import {
  extractJsonObject,
  normalizeAllergens,
  parseSize,
  splitTemperatureName,
  toImageUrl,
  toNullableNumber,
  toNullableString,
} from "./utils";

const MENU_JSON_ORIGIN = "https://www.starbucks.co.kr/upload/json/menu";
const DETAIL_ORIGIN = "https://www.starbucks.co.kr/menu";
const REQUEST_DELAY_MS = 75;

type StarbucksItem = Record<string, unknown>;

function isRecord(value: unknown): value is StarbucksItem {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function value(item: StarbucksItem, ...keys: string[]): unknown {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key];
    }
  }
  return null;
}

async function fetchCategory(category: StarbucksCategory): Promise<StarbucksItem[]> {
  const response = await fetch(`${MENU_JSON_ORIGIN}/${category.code}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Starbucks category ${category.id}: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  if (!isRecord(data) || !Array.isArray(data.list)) {
    throw new Error(`Starbucks category ${category.id} returned invalid JSON`);
  }

  return data.list.filter(isRecord);
}

async function fetchDetail(
  category: StarbucksCategory,
  productCode: string,
): Promise<StarbucksItem | null> {
  const page = category.type === "food" ? "food_view.do" : "drink_view.do";
  const url = new URL(`${DETAIL_ORIGIN}/${page}`);
  url.searchParams.set("product_cd", productCode);

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Starbucks menu ${productCode}: ${response.status} ${response.statusText}`,
    );
  }

  const $ = cheerio.load(await response.text());
  const script = $("script")
    .toArray()
    .map((element) => $(element).html() ?? "")
    .find((text) => text.includes("view: remapView("));
  const json = script ? extractJsonObject(script, "view: remapView(") : null;
  if (!json) {
    console.warn(`[starbucks] ${productCode} returned no detail data`);
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(json);
    if (isRecord(parsed)) return parsed;
  } catch {
    // 목록 JSON의 기본 데이터로 수집을 계속합니다.
  }

  console.warn(`[starbucks] ${productCode} returned invalid detail data`);
  return null;
}

function nutrition(
  detail: StarbucksItem,
  listItem: StarbucksItem,
  key: string,
  listKey: string,
): number | null {
  return toNullableNumber(value(detail, key) ?? value(listItem, listKey));
}

function createVariant(
  menuId: string,
  detail: StarbucksItem,
  listItem: StarbucksItem,
  temperature: "HOT" | "ICED" | null,
  sortOrder: number,
  light: boolean,
): NewMenuVariant {
  const suffix = light ? "_L" : "";
  const size = parseSize(value(detail, "STANDARD"), value(detail, "UNIT"));
  const baseName = [
    temperature,
    size.name === "기본" ? null : size.name,
  ]
    .filter(Boolean)
    .join(" ") || "기본";

  return {
    menuId,
    name: light ? `${baseName} LIGHT` : baseName,
    size: size.size,
    unit: size.unit,
    price: null,
    calories: nutrition(detail, listItem, `KCAL${suffix}`, `kcal${suffix}`),
    fat: nutrition(detail, listItem, `FAT${suffix}`, `fat${suffix}`),
    saturatedFat: nutrition(
      detail,
      listItem,
      `SAT_FAT${suffix}`,
      `sat_FAT${suffix}`,
    ),
    sugars: nutrition(detail, listItem, `SUGARS${suffix}`, `sugars${suffix}`),
    sodium: nutrition(detail, listItem, `SODIUM${suffix}`, `sodium${suffix}`),
    protein: nutrition(detail, listItem, `PROTEIN${suffix}`, `protein${suffix}`),
    caffeine: nutrition(
      detail,
      listItem,
      `CAFFEINE${suffix}`,
      `caffeine${suffix}`,
    ),
    carbohydrate: nutrition(
      detail,
      listItem,
      `CHABO${suffix}`,
      `chabo${suffix}`,
    ),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlStarbucksMenus(): Promise<StarbucksCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of STARBUCKS_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[starbucks] ${category.id}`);
    const list = await fetchCategory(category);
    if (list.length === 0) {
      console.warn(`[starbucks] ${category.id} returned no menu data`);
      continue;
    }

    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (const listItem of list) {
      const productCode = toNullableString(value(listItem, "product_CD"));
      const rawListName = toNullableString(value(listItem, "product_NM"));
      if (!productCode || !rawListName) continue;

      await sleep(REQUEST_DELAY_MS);
      const detail = (await fetchDetail(category, productCode)) ?? {};
      const rawName = toNullableString(value(detail, "PRODUCT_NM")) ?? rawListName;
      const hotYn = toNullableString(value(detail, "HOT_YN", "hot_YN"));
      const { menuName, temperature } = splitTemperatureName(
        rawName,
        hotYn,
        category.type === "drink",
      );
      const description =
        toNullableString(value(detail, "CONTENT", "RECOMMEND")) ??
        toNullableString(value(listItem, "content"));
      const allergens = normalizeAllergens(
        value(detail, "ALLERGY") ?? value(listItem, "allergy"),
      );
      const imageUrl = toImageUrl(
        value(listItem, "img_UPLOAD_PATH"),
        value(listItem, "file_PATH"),
      );
      const isAvailable = value(listItem, "sold_OUT") !== "Y";
      const menuKey = category.type === "food" ? productCode : menuName;

      let menu = categoryMenus.get(menuKey);
      if (!menu) {
        menu = {
          id: randomUUID(),
          categoryId: category.id,
          name: menuName,
          description,
          imageUrl,
          allergens,
          isAvailable,
          sortOrder: categoryMenus.size,
        };
        categoryMenus.set(menuKey, menu);
        menus.push(menu);
      } else {
        menu.description ??= description;
        menu.imageUrl ??= imageUrl;
        menu.allergens ??= allergens;
        menu.isAvailable = menu.isAvailable !== false || isAvailable;
      }

      let variantSortOrder = variantCounts.get(menu.id) ?? 0;
      variants.push(
        createVariant(
          menu.id,
          detail,
          listItem,
          temperature,
          variantSortOrder,
          false,
        ),
      );
      variantSortOrder += 1;

      if ((toNullableNumber(value(detail, "KCAL_L")) ?? 0) > 0) {
        variants.push(
          createVariant(
            menu.id,
            detail,
            listItem,
            temperature,
            variantSortOrder,
            true,
          ),
        );
        variantSortOrder += 1;
      }
      variantCounts.set(menu.id, variantSortOrder);
    }
  }

  return { menus, variants };
}
