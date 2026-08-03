import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { EDIYA_CATEGORIES, type EdiyaCategory } from "./cafe";
import { type CrawledMenu, type EdiyaCrawlResult } from "./types";
import {
  extractUnit,
  normalizeText,
  parseNumber,
  splitVariantName,
  toAbsoluteImageUrl,
} from "./utils";

const MAX_PAGE = 100;
const REQUEST_DELAY_MS = 300;
const EDIYA_MENU_URL = "https://www.ediya.com/inc/ajax_brand.php";

type CheerioApi = ReturnType<typeof cheerio.load>;
type CheerioItem = ReturnType<CheerioApi>;

async function fetchCategoryPage(category: EdiyaCategory, page: number) {
  const url = new URL(EDIYA_MENU_URL);
  url.searchParams.set("gubun", "menu_more");
  url.searchParams.set("product_cate", category.code);
  url.searchParams.set("chked_val", `${category.subCode},`);
  url.searchParams.set("skeyword", "");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch EDIYA category ${category.id}, page ${page}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function nutritionValue(
  $: CheerioApi,
  item: CheerioItem,
  label: string,
): string {
  return item
    .find(".pro_nutri dl")
    .filter((_, element) => $(element).find("dt").text().trim() === label)
    .find("dd")
    .first()
    .text()
    .trim();
}

function createVariant(
  $: CheerioApi,
  item: CheerioItem,
  menuId: string,
  variantName: string | null,
  sortOrder: number,
): NewMenuVariant {
  const sizeText = item
    .find(".pro_size")
    .text()
    .replace(/^컵용량\s*:\s*/, "")
    .trim();
  const nutrition = (label: string) => nutritionValue($, item, label);

  return {
    menuId,
    name: variantName || sizeText || "기본",
    size: parseNumber(sizeText),
    unit: extractUnit(sizeText),
    price: null,
    calories: parseNumber(nutrition("칼로리")),
    fat: parseNumber(nutrition("지방")),
    saturatedFat: parseNumber(nutrition("포화지방")),
    sugars: parseNumber(nutrition("당류")),
    sodium: parseNumber(nutrition("나트륨")),
    protein: parseNumber(nutrition("단백질")),
    caffeine: parseNumber(nutrition("카페인")),
    carbohydrate: parseNumber(nutrition("탄수화물")),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlEdiyaMenus(): Promise<EdiyaCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const [categoryIndex, category] of EDIYA_CATEGORIES.entries()) {
    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (let page = 1; page <= MAX_PAGE; page++) {
      if (page > 1 || categoryIndex > 0) {
        await sleep(REQUEST_DELAY_MS);
      }

      console.log(`[ediya] ${category.id}, page ${page}`);
      const html = await fetchCategoryPage(category, page);
      const $ = cheerio.load(html);
      const items = $("li").filter(
        (_, element) => $(element).find(".pro_detail").length > 0,
      );

      if (items.length === 0) break;

      items.each((_, element) => {
        const item = $(element);
        const detail = item.find(".pro_detail").first();
        const title = detail.find("h2").first().clone();
        title.find("span").remove();

        const rawName = normalizeText(title.text());
        if (!rawName) return;

        const { menuName, variantName } = splitVariantName(rawName);
        const description = normalizeText(detail.find(".detail_txt").text());
        const allergens = item
          .find(".pro_allergy")
          .text()
          .replace(/^알레르기 성분 정보\s*:\s*/, "")
          .trim();
        const imageUrl = toAbsoluteImageUrl(
          item.children("a").first().find("img").first().attr("src"),
        );

        let menu = categoryMenus.get(menuName);
        if (!menu) {
          menu = {
            id: randomUUID(),
            name: menuName,
            categoryId: category.id,
            description: description || null,
            allergens: allergens || null,
            imageUrl,
            sortOrder: categoryMenus.size,
          };
          categoryMenus.set(menuName, menu);
          menus.push(menu);
        } else {
          menu.description ??= description || null;
          menu.allergens ??= allergens || null;
          menu.imageUrl ??= imageUrl;
        }

        const variantSortOrder = variantCounts.get(menu.id) ?? 0;
        variants.push(
          createVariant($, item, menu.id, variantName, variantSortOrder),
        );
        variantCounts.set(menu.id, variantSortOrder + 1);
      });
    }
  }

  return { menus, variants };
}
