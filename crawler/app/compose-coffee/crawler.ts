import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import {
  COMPOSE_COFFEE_CATEGORIES,
  type ComposeCoffeeCategory,
} from "./cafe";
import { type ComposeCoffeeCrawlResult, type CrawledMenu } from "./types";
import {
  normalizeText,
  parseNumber,
  splitVariantName,
  toAbsoluteUrl,
} from "./utils";

const MENU_URL = "https://composecoffee.com/index.php";
const PAGE_SIZE = 20;
const MAX_PAGE = 100;
const REQUEST_DELAY_MS = 100;

type Nutrition = Map<string, { value: number; unit: string | null }>;

function createMenuUrl(
  category: ComposeCoffeeCategory,
  action: "dispCafemenuGalleryList" | "dispCafemenuGalleryItem",
  page: number,
): URL {
  const url = new URL(MENU_URL);
  url.searchParams.set("mid", "compose");
  url.searchParams.set("act", action);
  url.searchParams.set("category_srl", category.code);
  url.searchParams.set("page", String(page));
  return url;
}

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Compose Coffee ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function readNutrition(
  $: ReturnType<typeof cheerio.load>,
): Nutrition {
  const nutrition: Nutrition = new Map();

  $("#detailPage .cafemenu-nutrition-item").each((_, element) => {
    const item = $(element);
    const label = normalizeText(item.find(".cafemenu-nutrition-label").text());
    const valueElement = item.find(".cafemenu-nutrition-value").first();
    const unit = normalizeText(
      valueElement.find(".cafemenu-nutrition-unit").text(),
    ).toLowerCase();
    const valueText = valueElement
      .clone()
      .find(".cafemenu-nutrition-unit")
      .remove()
      .end()
      .text();
    const value = parseNumber(valueText);

    if (label && value !== null) {
      nutrition.set(label, { value, unit: unit || null });
    }
  });

  return nutrition;
}

async function crawlDetail(
  detailUrl: URL,
): Promise<{
  rawName: string;
  imageUrl: string | null;
  allergens: string | null;
  nutrition: Nutrition;
}> {
  const html = await fetchHtml(detailUrl, `menu ${detailUrl.href}`);
  const $ = cheerio.load(html);
  const root = $("#detailPage").first();

  if (root.length === 0) {
    throw new Error(`Compose Coffee detail page was empty: ${detailUrl.href}`);
  }

  const rawName = normalizeText(root.find("#detailTitle").text());
  if (!rawName) {
    throw new Error(`Compose Coffee menu name was empty: ${detailUrl.href}`);
  }

  const allergenText = normalizeText(
    root
      .find("#allergenIngredients")
      .clone()
      .find("strong")
      .remove()
      .end()
      .text(),
  );

  return {
    rawName,
    imageUrl: toAbsoluteUrl(root.find("#detailImage").attr("src")),
    allergens: allergenText || null,
    nutrition: readNutrition($),
  };
}

function createVariant(
  menuId: string,
  variantName: string | null,
  nutrition: Nutrition,
  sortOrder: number,
): NewMenuVariant {
  const size =
    nutrition.get("컵용량") ??
    nutrition.get("무게") ??
    nutrition.get("중량");
  const value = (label: string) => nutrition.get(label)?.value ?? null;

  return {
    menuId,
    name:
      variantName ||
      (size ? `${size.value}${size.unit ?? ""}` : "기본"),
    size: size?.value ?? null,
    unit: size?.unit ?? null,
    price: null,
    calories: value("칼로리"),
    fat: value("지방"),
    saturatedFat: value("포화지방"),
    sugars: value("당류"),
    sodium: value("나트륨"),
    protein: value("단백질"),
    caffeine: value("카페인"),
    carbohydrate: value("탄수화물"),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlComposeCoffeeMenus(): Promise<ComposeCoffeeCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of COMPOSE_COFFEE_CATEGORIES) {
    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (let page = 1; page <= MAX_PAGE; page++) {
      if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

      console.log(`[compose-coffee] ${category.id}, page ${page}`);
      const listUrl = createMenuUrl(
        category,
        "dispCafemenuGalleryList",
        page,
      );
      const html = await fetchHtml(listUrl, `${category.id}, page ${page}`);
      const $ = cheerio.load(html);
      const detailUrls = $("#listPage a.cafemenu-menu-item")
        .toArray()
        .map((element) => toAbsoluteUrl($(element).attr("href")))
        .filter((url): url is string => url !== null);

      if (detailUrls.length === 0) break;

      for (const detailUrl of detailUrls) {
        await sleep(REQUEST_DELAY_MS);
        const detail = await crawlDetail(new URL(detailUrl));
        const { menuName, variantName } = splitVariantName(detail.rawName);

        let menu = categoryMenus.get(menuName);
        if (!menu) {
          menu = {
            id: randomUUID(),
            categoryId: category.id,
            name: menuName,
            description: null,
            imageUrl: detail.imageUrl,
            allergens: detail.allergens,
            sortOrder: categoryMenus.size,
          };
          categoryMenus.set(menuName, menu);
          menus.push(menu);
        } else {
          menu.imageUrl ??= detail.imageUrl;
          menu.allergens ??= detail.allergens;
        }

        const variantSortOrder = variantCounts.get(menu.id) ?? 0;
        variants.push(
          createVariant(
            menu.id,
            variantName,
            detail.nutrition,
            variantSortOrder,
          ),
        );
        variantCounts.set(menu.id, variantSortOrder + 1);
      }

      if (detailUrls.length < PAGE_SIZE) break;
    }

    if (categoryMenus.size === 0) {
      throw new Error(
        `Compose Coffee category ${category.id} returned no menu data`,
      );
    }
  }

  return { menus, variants };
}
