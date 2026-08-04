import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { THE_VENTI_CATEGORIES, type TheVentiCategory } from "./cafe";
import { type CrawledMenu, type TheVentiCrawlResult } from "./types";
import {
  extractSize,
  extractTemperature,
  normalizeText,
  parseNumber,
  splitMenuName,
  toAbsoluteUrl,
} from "./utils";

const LIST_URL = "https://www.theventi.co.kr/new2022/menu/all.html";
const REQUEST_DELAY_MS = 100;

type MenuDetail = {
  rawName: string;
  description: string | null;
  imageUrl: string | null;
  allergens: string | null;
  servingSize: string;
  calories: number | null;
  sugars: number | null;
  protein: number | null;
  saturatedFat: number | null;
  sodium: number | null;
  caffeine: number | null;
};

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch The Venti ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function createListUrl(category: TheVentiCategory): URL {
  const url = new URL(LIST_URL);
  url.searchParams.set("mode", category.code);
  return url;
}

async function crawlDetail(detailUrl: URL): Promise<MenuDetail> {
  const html = await fetchHtml(detailUrl, `menu ${detailUrl.href}`);
  const $ = cheerio.load(html);
  const root = $(".menu_desc_wrap").first();

  if (root.length === 0) {
    throw new Error(`The Venti detail page was empty: ${detailUrl.href}`);
  }

  const rawName = normalizeText(root.find(".txt_bx .tit span").last().text());
  if (!rawName) {
    throw new Error(`The Venti menu name was empty: ${detailUrl.href}`);
  }

  const headers = root
    .find(".menu-ingredient table thead th")
    .toArray()
    .map((element) =>
      normalizeText($(element).text()).replace(/\([^)]*\)/g, ""),
    );
  const cells = root
    .find(".menu-ingredient table tbody tr")
    .first()
    .find("td")
    .toArray();
  const cellValue = (label: string): string => {
    const index = headers.indexOf(label);
    return index >= 0 ? normalizeText($(cells[index]).text()) : "";
  };

  return {
    rawName,
    description: normalizeText(root.find(".txt.scroll-con-y").text()) || null,
    imageUrl: toAbsoluteUrl(root.find(".img_bx img").attr("src")),
    allergens: cellValue("알레르기") || null,
    servingSize: cellValue("1회 제공량"),
    calories: parseNumber(cellValue("열량")),
    sugars: parseNumber(cellValue("당류")),
    protein: parseNumber(cellValue("단백질")),
    saturatedFat: parseNumber(cellValue("포화지방")),
    sodium: parseNumber(cellValue("나트륨")),
    caffeine: parseNumber(cellValue("카페인")),
  };
}

function createVariant(
  menuId: string,
  detail: MenuDetail,
  titleTemperature: "HOT" | "ICED" | null,
  sortOrder: number,
): NewMenuVariant {
  const description = detail.description ?? "";
  const temperature = titleTemperature ?? extractTemperature(description);
  const { size, unit, label } = extractSize(
    detail.servingSize || detail.rawName,
    description,
  );

  return {
    menuId,
    name: temperature || label || (size && unit ? `${size}${unit}` : "기본"),
    size,
    unit,
    price: null,
    calories: detail.calories,
    fat: null,
    saturatedFat: detail.saturatedFat,
    sugars: detail.sugars,
    sodium: detail.sodium,
    protein: detail.protein,
    caffeine: detail.caffeine,
    carbohydrate: null,
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlTheVentiMenus(): Promise<TheVentiCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of THE_VENTI_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[the-venti] ${category.id}`);
    const listUrl = createListUrl(category);
    const html = await fetchHtml(listUrl, category.id);
    const $ = cheerio.load(html);
    const detailUrls = $("div.menu_list > ul > li a.popup-link")
      .toArray()
      .map((element) => toAbsoluteUrl($(element).attr("href")))
      .filter((url): url is string => url !== null);

    if (detailUrls.length === 0) {
      throw new Error(`The Venti category ${category.id} returned no menu data`);
    }

    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (const detailUrl of detailUrls) {
      await sleep(REQUEST_DELAY_MS);
      const detail = await crawlDetail(new URL(detailUrl));
      const { menuName, temperature } = splitMenuName(detail.rawName);

      let menu = categoryMenus.get(menuName);
      if (!menu) {
        menu = {
          id: randomUUID(),
          categoryId: category.id,
          name: menuName,
          description: detail.description,
          imageUrl: detail.imageUrl,
          allergens: detail.allergens,
          sortOrder: categoryMenus.size,
        };
        categoryMenus.set(menuName, menu);
        menus.push(menu);
      } else {
        menu.description ??= detail.description;
        menu.imageUrl ??= detail.imageUrl;
        menu.allergens ??= detail.allergens;
      }

      const variantSortOrder = variantCounts.get(menu.id) ?? 0;
      variants.push(
        createVariant(menu.id, detail, temperature, variantSortOrder),
      );
      variantCounts.set(menu.id, variantSortOrder + 1);
    }
  }

  return { menus, variants };
}
