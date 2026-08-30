import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { GONG_CHA_CATEGORIES, type GongChaCategory } from "./cafe";
import { type CrawledMenu, type GongChaCrawlResult } from "./types";
import {
  expandTable,
  headerUnit,
  normalizeAllergens,
  normalizeText,
  nutritionLabel,
  parseNumber,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://www.gong-cha.co.kr/brand/menu";
const REQUEST_DELAY_MS = 100;

type CheerioApi = ReturnType<typeof cheerio.load>;
type CheerioSelection = ReturnType<CheerioApi>;

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Gong Cha ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function fetchCategory(category: GongChaCategory): Promise<string[]> {
  const url = new URL(`${MENU_ORIGIN}/ajaxlist`);
  url.searchParams.set("category", category.code);

  const $ = cheerio.load(await fetchHtml(url, category.id));

  return [
    ...new Set(
      $("a[href*='product_detail']")
        .toArray()
        .map((element) => $(element).attr("href") ?? "")
        .map((href) => href.match(/[?&]no=(\d+)/)?.[1])
        .filter((no): no is string => Boolean(no)),
    ),
  ];
}

function createVariants($: CheerioApi, menuId: string): NewMenuVariant[] {
  const table = $(".table-list table").first();
  if (table.length === 0) return [];

  const toCells = (selection: CheerioSelection) =>
    selection.toArray().map((element) => {
      const cell = $(element);

      return {
        text: normalizeText(cell.text()),
        rowSpan: Number(cell.attr("rowspan") ?? 1),
        colSpan: Number(cell.attr("colspan") ?? 1),
      };
    });
  const { headers, rows } = expandTable(
    toCells(table.find("thead th")),
    table
      .find("tbody tr")
      .toArray()
      .map((row) => toCells($(row).find("td"))),
  );

  const labels = headers.map(nutritionLabel);
  const sizeIndex = labels.findIndex((label) =>
    ["컵 용량", "일회제공량", "1회 제공량", "중량"].includes(label),
  );
  const nameIndexes = labels
    .map((label, index) => (label === "구분" ? index : -1))
    .filter((index) => index >= 0);

  return rows.map((row, sortOrder) => {
    const valueOf = (label: string): number | null => {
      const index = labels.indexOf(label);
      return index >= 0 ? parseNumber(row[index] ?? "") : null;
    };
    const name = nameIndexes
      .map((index) => row[index])
      .filter((part) => part && part !== "-")
      .join(" ");

    return {
      menuId,
      name: name || "기본",
      size: sizeIndex >= 0 ? parseNumber(row[sizeIndex] ?? "") : null,
      unit: sizeIndex >= 0 ? headerUnit(headers[sizeIndex]) : null,
      price: null,
      calories: valueOf("열량"),
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

async function crawlDetail(
  category: GongChaCategory,
  no: string,
  sortOrder: number,
): Promise<{ menu: CrawledMenu; variants: NewMenuVariant[] } | null> {
  const url = new URL(`${MENU_ORIGIN}/product_detail`);
  url.searchParams.set("category", category.code);
  url.searchParams.set("no", no);

  const $ = cheerio.load(await fetchHtml(url, `menu ${no}`));
  const detail = $(".menu-detail-conts .item").first();
  const name = normalizeText(detail.find(".text-a .t1").first().text());

  if (!name) {
    console.warn(`[gong-cha] ${category.id}/${no} returned no menu name`);
    return null;
  }

  const menuId = randomUUID();
  const menu: CrawledMenu = {
    id: menuId,
    categoryId: category.id,
    name,
    description: normalizeText(detail.find(".text-a .t2").first().text()) || null,
    imageUrl: toAbsoluteImageUrl(detail.find(".picture img").first().attr("src")),
    allergens: normalizeAllergens(detail.find(".caution").first().text()),
    sortOrder,
  };
  const variants = createVariants($, menuId);

  return {
    menu,
    variants:
      variants.length > 0
        ? variants
        : [
            {
              menuId,
              name: "기본",
              size: null,
              unit: null,
              price: null,
              calories: null,
              fat: null,
              saturatedFat: null,
              sugars: null,
              sodium: null,
              protein: null,
              caffeine: null,
              carbohydrate: null,
              isDefault: true,
              sortOrder: 0,
            },
          ],
  };
}

export async function crawlGongChaMenus(): Promise<GongChaCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of GONG_CHA_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[gong-cha] ${category.id}`);
    const numbers = await fetchCategory(category);
    if (numbers.length === 0) {
      throw new Error(`Gong Cha category ${category.id} returned no menu data`);
    }

    let sortOrder = 0;
    for (const no of numbers) {
      await sleep(REQUEST_DELAY_MS);
      const result = await crawlDetail(category, no, sortOrder);
      if (!result) continue;

      menus.push(result.menu);
      variants.push(...result.variants);
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
