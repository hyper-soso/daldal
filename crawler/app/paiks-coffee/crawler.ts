import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import {
  PAIKS_COFFEE_CATEGORIES,
  type PaiksCoffeeCategory,
} from "./cafe";
import { type CrawledMenu, type PaiksCoffeeCrawlResult } from "./types";
import {
  extractSize,
  normalizeText,
  parseNumber,
  splitVariantName,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://paikdabang.com/menu";
const REQUEST_DELAY_MS = 300;

type CheerioApi = ReturnType<typeof cheerio.load>;
type CheerioItem = ReturnType<CheerioApi>;

async function fetchCategoryPage(category: PaiksCoffeeCategory) {
  const response = await fetch(`${MENU_ORIGIN}/${category.path}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Paik's Coffee category ${category.id}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function basisValue(item: CheerioItem, label: string): string {
  return normalizeText(
    item
      .find(".menu_ingredient_basis")
      .filter((_, element) => normalizeText(item.find(element).text()).includes(label))
      .first()
      .text(),
  );
}

function nutrientValue(item: CheerioItem, label: string): number | null {
  const row = item
    .find(".ingredient_table > li")
    .filter((_, element) => {
      const nutrientName = normalizeText(item.find(element).find("div").first().text())
        .replace(/\([^)]*\)/g, "")
        .replace(/\s+/g, "");

      return nutrientName === label;
    })
    .first();

  return parseNumber(row.find("div").eq(1).text());
}

function createVariant(
  item: CheerioItem,
  menuId: string,
  variantName: string | null,
  sortOrder: number,
): NewMenuVariant {
  const sizeText = basisValue(item, "컵용량");
  const { size, unit } = extractSize(sizeText);

  return {
    menuId,
    name: variantName || (size && unit ? `${size}${unit}` : "기본"),
    size,
    unit,
    price: null,
    calories: nutrientValue(item, "칼로리") ?? nutrientValue(item, "열량"),
    fat: nutrientValue(item, "지방"),
    saturatedFat: nutrientValue(item, "포화지방"),
    sugars: nutrientValue(item, "당류") ?? nutrientValue(item, "당"),
    sodium: nutrientValue(item, "나트륨"),
    protein: nutrientValue(item, "단백질"),
    caffeine: nutrientValue(item, "카페인"),
    carbohydrate: nutrientValue(item, "탄수화물"),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlPaiksCoffeeMenus(): Promise<PaiksCoffeeCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const [categoryIndex, category] of PAIKS_COFFEE_CATEGORIES.entries()) {
    if (categoryIndex > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[paiks-coffee] ${category.id}`);
    const html = await fetchCategoryPage(category);
    const $ = cheerio.load(html);
    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    $("div.menu_list > ul > li").each((_, element) => {
      const item = $(element);
      const rawName = normalizeText(item.find(".menu_tit").first().text());
      if (!rawName) return;

      const { menuName, variantName } = splitVariantName(rawName);
      const description = normalizeText(item.find(".hover .txt").first().text());
      const allergenText = basisValue(item, "알레르기 유발 성분");
      const allergens = allergenText
        .replace(/^※\s*알레르기\s*유발\s*성분\s*:\s*/, "")
        .trim();
      const imageUrl = toAbsoluteImageUrl(
        item.find(".thumb img").first().attr("src"),
      );

      let menu = categoryMenus.get(menuName);
      if (!menu) {
        menu = {
          id: randomUUID(),
          categoryId: category.id,
          name: menuName,
          description: description || null,
          imageUrl,
          allergens: allergens || null,
          sortOrder: categoryMenus.size,
        };
        categoryMenus.set(menuName, menu);
        menus.push(menu);
      } else {
        menu.description ??= description || null;
        menu.imageUrl ??= imageUrl;
        menu.allergens ??= allergens || null;
      }

      const variantSortOrder = variantCounts.get(menu.id) ?? 0;
      variants.push(
        createVariant(item, menu.id, variantName, variantSortOrder),
      );
      variantCounts.set(menu.id, variantSortOrder + 1);
    });
  }

  return { menus, variants };
}
