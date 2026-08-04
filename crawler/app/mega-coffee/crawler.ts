import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { MEGA_COFFEE_CATEGORIES, type MegaCoffeeCategory } from "./cafe";
import { type CrawledMenu, type MegaCoffeeCrawlResult } from "./types";
import {
  extractUnit,
  normalizeText,
  parseNumber,
  splitVariantName,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_URL = "https://www.mega-mgccoffee.com/menu/menu.php";
const PAGE_SIZE = 20;
const MAX_PAGE = 100;
const REQUEST_DELAY_MS = 300;

type CheerioApi = ReturnType<typeof cheerio.load>;
type CheerioItem = ReturnType<CheerioApi>;

async function fetchCategoryPage(category: MegaCoffeeCategory, page: number) {
  const url = new URL(MENU_URL);
  url.searchParams.set("menu_category1", category.topCode);
  url.searchParams.set("menu_category2", category.topCode);
  url.searchParams.set("category", category.code);
  url.searchParams.set("page", String(page));

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Mega Coffee category ${category.id}, page ${page}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function nutritionValue(
  $: CheerioApi,
  item: CheerioItem,
  label: string,
): number | null {
  const nutrition = item
    .find(".inner_modal .cont_list li")
    .filter((_, element) =>
      normalizeText($(element).text()).startsWith(label),
    )
    .first()
    .text();

  return parseNumber(nutrition);
}

function createVariant(
  $: CheerioApi,
  item: CheerioItem,
  menuId: string,
  variantName: string | null,
  sortOrder: number,
): NewMenuVariant {
  const detailValues = item
    .find(".inner_modal .cont_text_box > .cont_text")
    .eq(1)
    .find(".cont_text_inner");
  const sizeText = normalizeText(detailValues.eq(0).text()).replace(
    /^컵\s*용량\s*:\s*/,
    "",
  );
  const caloriesText = normalizeText(detailValues.eq(1).text());
  const caloriesMatch = caloriesText.match(/(-?[\d,.]+)\s*kcal/i);

  return {
    menuId,
    name: variantName || sizeText || "기본",
    size: parseNumber(sizeText),
    unit: extractUnit(sizeText),
    price: null,
    calories: parseNumber(caloriesMatch?.[1] ?? caloriesText),
    fat: nutritionValue($, item, "지방"),
    saturatedFat: nutritionValue($, item, "포화지방"),
    sugars: nutritionValue($, item, "당류"),
    sodium: nutritionValue($, item, "나트륨"),
    protein: nutritionValue($, item, "단백질"),
    caffeine: nutritionValue($, item, "카페인"),
    carbohydrate: nutritionValue($, item, "탄수화물"),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlMegaCoffeeMenus(): Promise<MegaCoffeeCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const [categoryIndex, category] of MEGA_COFFEE_CATEGORIES.entries()) {
    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (let page = 1; page <= MAX_PAGE; page++) {
      if (page > 1 || categoryIndex > 0) {
        await sleep(REQUEST_DELAY_MS);
      }

      console.log(`[mega-coffee] ${category.id}, page ${page}`);
      const html = await fetchCategoryPage(category, page);
      const $ = cheerio.load(html);
      const items = $("ul#menu_list > li");

      if (items.length === 0) break;

      items.each((_, element) => {
        const item = $(element);
        const modal = item.find(".inner_modal").first();
        const rawName = normalizeText(
          modal.find(".inner_modal_title .cont_text_title").first().text() ||
            item.find(".cont_gallery_list_box .cont_text_title").first().text(),
        );
        if (!rawName) return;

        const temperatureLabel = normalizeText(
          item.find(".cont_gallery_list_label").first().text(),
        );
        const { menuName, variantName } = splitVariantName(
          rawName,
          temperatureLabel,
        );
        const description = normalizeText(
          modal.find(".cont_text_box > .cont_text").eq(2).text() ||
            item.find(".cont_gallery_list_box .text2").first().text(),
        );
        const allergenText = normalizeText(
          modal.find(".cont_text_box > .cont_text.cont_text_info").last().text(),
        );
        const allergens = allergenText
          .replace(/^알레르기\s*성분\s*:\s*/, "")
          .replace(/고카페인\s*함유.*$/, "")
          .trim();
        const imageUrl = toAbsoluteImageUrl(
          item.find(".cont_gallery_list_img img").first().attr("src"),
        );

        let menu = categoryMenus.get(menuName);
        if (!menu) {
          menu = {
            id: randomUUID(),
            name: menuName,
            categoryId: category.id,
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
          createVariant($, item, menu.id, variantName, variantSortOrder),
        );
        variantCounts.set(menu.id, variantSortOrder + 1);
      });

      if (items.length < PAGE_SIZE) break;
    }
  }

  return { menus, variants };
}
