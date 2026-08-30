import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import {
  TENPERCENT_COFFEE_CATEGORIES,
  type TenpercentCoffeeCategory,
} from "./cafe";
import { type CrawledMenu, type TenpercentCoffeeCrawlResult } from "./types";
import { normalizeText, toAbsoluteImageUrl } from "./utils";

const BOARD_URL = "https://tenpercentcoffee.com/bbs/board.php";
const MAX_PAGE = 30;
const REQUEST_DELAY_MS = 200;

type CrawledItem = { key: string; name: string; imageUrl: string | null };

async function fetchPage(
  category: TenpercentCoffeeCategory,
  page: number,
): Promise<CrawledItem[]> {
  const url = new URL(BOARD_URL);
  url.searchParams.set("bo_table", category.boardTable);
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Tenpercent Coffee category ${category.id}, page ${page}: ${response.status} ${response.statusText}`,
    );
  }

  const $ = cheerio.load(await response.text());

  return $(".gallery > div")
    .toArray()
    .map((element) => {
      const item = $(element);
      const link = item.find("span[onclick]").first().attr("onclick") ?? "";
      const image = item.find("a.big").first();

      return {
        key:
          link.match(/wr_id=(\d+)/)?.[1] ??
          normalizeText(item.find("span[onclick]").first().text()),
        name:
          normalizeText(item.find("span[onclick]").first().text()) ||
          normalizeText(image.find("img").first().attr("title") ?? ""),
        imageUrl: toAbsoluteImageUrl(
          image.attr("href") ?? image.find("img").first().attr("src"),
        ),
      };
    })
    .filter((item) => item.key && item.name);
}

export async function crawlTenpercentCoffeeMenus(): Promise<TenpercentCoffeeCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of TENPERCENT_COFFEE_CATEGORIES) {
    const seen = new Set<string>();
    let sortOrder = 0;

    for (let page = 1; page <= MAX_PAGE; page += 1) {
      if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

      console.log(`[tenpercent-coffee] ${category.id}, page ${page}`);
      const items = (await fetchPage(category, page)).filter(
        (item) => !seen.has(item.key),
      );
      if (items.length === 0) break;

      for (const item of items) {
        seen.add(item.key);

        const menuId = randomUUID();
        menus.push({
          id: menuId,
          categoryId: category.id,
          name: item.name,
          description: null,
          imageUrl: item.imageUrl,
          allergens: null,
          sortOrder,
        });
        /** 텐퍼센트커피 홈페이지는 영양성분을 공개하지 않는다. */
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
        sortOrder += 1;
      }
    }

    if (sortOrder === 0) {
      throw new Error(
        `Tenpercent Coffee category ${category.id} returned no menu data`,
      );
    }
  }

  return { menus, variants };
}
