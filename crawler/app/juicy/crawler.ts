import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { JUICY_CATEGORIES, type JuicyCategory } from "./cafe";
import { type CrawledMenu, type JuicyCrawlResult } from "./types";
import { normalizeText, toAbsoluteImageUrl } from "./utils";

const PRODUCT_ORIGIN = "http://www.no1juicy.com/products";
const REQUEST_DELAY_MS = 200;

async function fetchCategory(category: JuicyCategory): Promise<string> {
  const response = await fetch(`${PRODUCT_ORIGIN}/${category.path}`, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Juicy category ${category.id}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

export async function crawlJuicyMenus(): Promise<JuicyCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of JUICY_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[juicy] ${category.id}`);
    const $ = cheerio.load(await fetchCategory(category));
    const items = $("section.menu_type li")
      .toArray()
      .map((element) => {
        const item = $(element);

        return {
          name: normalizeText(item.find("dl dt").first().text()),
          description: normalizeText(item.find("dl dd").first().text()),
          /** 이미지는 지연 로딩이라 `src` 대신 `data-src-pc`에 들어 있다. */
          imageUrl: toAbsoluteImageUrl(
            item.find("img[data-src-pc]").first().attr("data-src-pc"),
          ),
        };
      })
      .filter((item) => item.name);

    if (items.length === 0) {
      throw new Error(`Juicy category ${category.id} returned no menu data`);
    }

    const seen = new Set<string>();

    for (const item of items) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);

      const menuId = randomUUID();
      menus.push({
        id: menuId,
        categoryId: category.id,
        name: item.name,
        description: item.description || null,
        imageUrl: item.imageUrl,
        allergens: null,
        sortOrder: seen.size - 1,
      });
      /** 쥬씨 홈페이지는 영양성분을 공개하지 않는다. */
      variants.push({
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
      });
    }
  }

  return { menus, variants };
}
