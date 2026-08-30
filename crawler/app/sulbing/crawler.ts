import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { SULBING_CATEGORIES, type SulbingCategory } from "./cafe";
import { type CrawledMenu, type SulbingCrawlResult } from "./types";
import {
  normalizeAllergens,
  normalizeText,
  parseNutrition,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://sulbing.com/menu";
const REQUEST_DELAY_MS = 100;

type CheerioApi = ReturnType<typeof cheerio.load>;

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Sulbing ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function fetchCategory(category: SulbingCategory): Promise<string[]> {
  const url = new URL(`${MENU_ORIGIN}/`);
  url.searchParams.set("type", category.type);

  const $ = cheerio.load(await fetchHtml(url, category.id));
  const section = $(".menuListArea")
    .filter(
      (_, element) =>
        normalizeText($(element).find(".menuTitle").first().text()) ===
        category.title,
    )
    .first();

  return [
    ...new Set(
      section
        .find(".menuList a.item")
        .toArray()
        .map((element) => $(element).attr("href") ?? "")
        .map((href) => href.match(/menu=(\d+)/)?.[1])
        .filter((menu): menu is string => Boolean(menu)),
    ),
  ];
}

function infoValue($: CheerioApi, label: string): string {
  return $(".infomation li")
    .filter(
      (_, element) =>
        normalizeText($(element).find(".title").first().text()) === label,
    )
    .first()
    .find(".con")
    .text();
}

function createVariant($: CheerioApi, menuId: string): NewMenuVariant {
  const nutrition = parseNutrition(infoValue($, "영양정보"));

  return {
    menuId,
    name: "기본",
    size: null,
    unit: null,
    price: null,
    calories: nutrition.get("열량") ?? null,
    fat: nutrition.get("지방") ?? null,
    saturatedFat: nutrition.get("포화지방") ?? null,
    sugars: nutrition.get("당류") ?? null,
    sodium: nutrition.get("나트륨") ?? null,
    protein: nutrition.get("단백질") ?? null,
    caffeine: nutrition.get("카페인") ?? null,
    carbohydrate: nutrition.get("탄수화물") ?? null,
    isDefault: true,
    sortOrder: 0,
  };
}

async function crawlDetail(
  menuNo: string,
  category: SulbingCategory,
  sortOrder: number,
): Promise<{ menu: CrawledMenu; variant: NewMenuVariant } | null> {
  const url = new URL(`${MENU_ORIGIN}/menu_view.php`);
  url.searchParams.set("menu", menuNo);

  const $ = cheerio.load(await fetchHtml(url, `menu ${menuNo}`));
  const name = normalizeText($(".textArea .productTitle").first().text());

  if (!name) {
    console.warn(`[sulbing] ${menuNo} returned no menu name`);
    return null;
  }

  const menuId = randomUUID();
  const description = [
    normalizeText($(".textArea .subTitle").first().text()),
    normalizeText($(".textArea .desc").first().text()),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    menu: {
      id: menuId,
      categoryId: category.id,
      name,
      description: description || null,
      imageUrl: toAbsoluteImageUrl(
        $(".menuSlideBig .imgArea img").first().attr("src"),
      ),
      allergens: normalizeAllergens(infoValue($, "알레르기 정보")),
      sortOrder,
    },
    variant: createVariant($, menuId),
  };
}

export async function crawlSulbingMenus(): Promise<SulbingCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of SULBING_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[sulbing] ${category.id}`);
    const menuNumbers = await fetchCategory(category);
    if (menuNumbers.length === 0) {
      throw new Error(`Sulbing category ${category.id} returned no menu data`);
    }

    let sortOrder = 0;
    for (const menuNo of menuNumbers) {
      await sleep(REQUEST_DELAY_MS);
      const result = await crawlDetail(menuNo, category, sortOrder);
      if (!result) continue;

      menus.push(result.menu);
      variants.push(result.variant);
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
