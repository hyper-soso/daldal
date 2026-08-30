import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { MAMMOTH_COFFEE_CATEGORIES, type MammothCoffeeCategory } from "./cafe";
import { type CrawledMenu, type MammothCoffeeCrawlResult } from "./types";
import {
  normalizeText,
  nutritionLabel,
  parseNumber,
  parseVariantHeader,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://www.mmthcoffee.com/sub/menu";
const REQUEST_DELAY_MS = 100;

type CheerioApi = ReturnType<typeof cheerio.load>;

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Mammoth Coffee ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function fetchCategory(
  category: MammothCoffeeCategory,
): Promise<string[]> {
  const url = new URL(`${MENU_ORIGIN}/list_coffee_sub.php`);
  url.searchParams.set("menuType", category.code);

  const html = await fetchHtml(url, category.id);

  return [
    ...new Set([...html.matchAll(/goViewB\((\d+)\)/g)].map((match) => match[1])),
  ];
}

/**
 * 표는 `구분 | HOT(16oz) | ICE(22oz)` 처럼 열이 사이즈, 행이 영양성분이다.
 */
function createVariants($: CheerioApi, menuId: string): NewMenuVariant[] {
  const headers = $(".i_table table thead th")
    .toArray()
    .map((element) => normalizeText($(element).text()));
  const rows = $(".i_table table tbody tr")
    .toArray()
    .map((row) =>
      $(row)
        .find("td")
        .toArray()
        .map((cell) => normalizeText($(cell).text())),
    );

  const variants: NewMenuVariant[] = [];

  for (let column = 1; column < headers.length; column += 1) {
    if (!headers[column]) continue;

    const header = parseVariantHeader(headers[column]);
    const valueOf = (label: string): number | null => {
      const row = rows.find((cells) => nutritionLabel(cells[0] ?? "") === label);
      return row ? parseNumber(row[column] ?? "") : null;
    };

    variants.push({
      menuId,
      name: header.name || "기본",
      size: header.size,
      unit: header.unit,
      price: null,
      calories: valueOf("칼로리"),
      fat: null,
      saturatedFat: null,
      sugars: valueOf("당류"),
      sodium: valueOf("나트륨"),
      protein: valueOf("단백질"),
      caffeine: valueOf("카페인"),
      carbohydrate: null,
      isDefault: variants.length === 0,
      sortOrder: variants.length,
    });
  }

  return variants;
}

async function crawlDetail(
  menuSeq: string,
  category: MammothCoffeeCategory,
  sortOrder: number,
): Promise<{ menu: CrawledMenu; variants: NewMenuVariant[] } | null> {
  const url = new URL(`${MENU_ORIGIN}/list_coffee_view.php`);
  url.searchParams.set("menuSeq", menuSeq);

  const $ = cheerio.load(await fetchHtml(url, `menu ${menuSeq}`));
  const name = normalizeText($(".i_tit strong").first().text());

  if (!name) {
    console.warn(`[mammoth-coffee] ${menuSeq} returned no menu name`);
    return null;
  }

  const menuId = randomUUID();
  const englishName = normalizeText($(".i_tit li.eng").first().text());
  const menu: CrawledMenu = {
    id: menuId,
    categoryId: category.id,
    name,
    description: normalizeText($(".txt_area").text()) || englishName || null,
    imageUrl: toAbsoluteImageUrl($(".img_wrap img").first().attr("src")),
    allergens: null,
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

export async function crawlMammothCoffeeMenus(): Promise<MammothCoffeeCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of MAMMOTH_COFFEE_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[mammoth-coffee] ${category.id}`);
    const menuSeqs = await fetchCategory(category);
    if (menuSeqs.length === 0) {
      throw new Error(
        `Mammoth Coffee category ${category.id} returned no menu data`,
      );
    }

    let sortOrder = 0;
    for (const menuSeq of menuSeqs) {
      await sleep(REQUEST_DELAY_MS);
      const result = await crawlDetail(menuSeq, category, sortOrder);
      if (!result) continue;

      menus.push(result.menu);
      variants.push(...result.variants);
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
