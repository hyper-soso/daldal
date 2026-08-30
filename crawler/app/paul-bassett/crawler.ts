import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { PAUL_BASSETT_CATEGORIES, type PaulBassettCategory } from "./cafe";
import { type CrawledMenu, type PaulBassettCrawlResult } from "./types";
import {
  normalizeAllergens,
  normalizeText,
  parseNumber,
  parseServingSize,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://www.baristapaulbassett.co.kr/menu";
const REQUEST_DELAY_MS = 100;

type CheerioApi = ReturnType<typeof cheerio.load>;

async function fetchHtml(url: URL, context: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Paul Bassett ${context}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function fetchCategory(
  category: PaulBassettCategory,
): Promise<string[]> {
  const url = new URL(`${MENU_ORIGIN}/List.pb`);
  url.searchParams.set("cid1", category.topCode);
  url.searchParams.set("cid2", category.code);

  const $ = cheerio.load(await fetchHtml(url, category.id));

  return $(".menuList .listStyleB > li a")
    .toArray()
    .map((element) => $(element).attr("onclick") ?? "")
    .map((onclick) => onclick.match(/goView\('([^']+)'\)/)?.[1])
    .filter((dpid): dpid is string => Boolean(dpid));
}

function infoValue($: CheerioApi, label: string): string {
  const item = $("ul.info > li")
    .filter((_, element) => normalizeText($(element).find("span").first().text()) === label)
    .first()
    .clone();
  item.find("span").remove();

  return normalizeText(item.text());
}

function createVariants($: CheerioApi, menuId: string): NewMenuVariant[] {
  const sizeNames = new Map(
    $("#pSize option")
      .toArray()
      .map((element) => [
        $(element).attr("value") ?? "",
        normalizeText($(element).text()),
      ]),
  );

  return $("#pSizeInfoLayer > div[id^='pSize_']")
    .toArray()
    .map((element, sortOrder) => {
      const block = $(element);
      const sizeCode = (block.attr("id") ?? "").replace("pSize_", "");
      const serving = parseServingSize(block.find(".sizeMl").text());
      const nutrition = (label: string): number | null => {
        const value = block
          .find("li")
          .filter(
            (_, item) => normalizeText($(item).find(".tit").text()) === label,
          )
          .first()
          .find(".num")
          .text();

        return parseNumber(normalizeText(value));
      };

      return {
        menuId,
        name: sizeNames.get(sizeCode) || "기본",
        size: serving.size,
        unit: serving.unit,
        price: null,
        calories: nutrition("열량(kcal)"),
        fat: null,
        saturatedFat: nutrition("포화지방(g)"),
        sugars: nutrition("당류(g)"),
        sodium: nutrition("나트륨(mg)"),
        protein: nutrition("단백질(g)"),
        caffeine: nutrition("카페인(mg)"),
        carbohydrate: null,
        isDefault: sortOrder === 0,
        sortOrder,
      } satisfies NewMenuVariant;
    });
}

async function crawlDetail(
  dpid: string,
  category: PaulBassettCategory,
  sortOrder: number,
): Promise<{ menu: CrawledMenu; variants: NewMenuVariant[] } | null> {
  const url = new URL(`${MENU_ORIGIN}/View.pb`);
  url.searchParams.set("dpid", dpid);

  const $ = cheerio.load(await fetchHtml(url, `menu ${dpid}`));
  const title = $(".menuTit dl dt").first().clone();
  const englishName = normalizeText(title.find("span").first().text());
  title.find("span").remove();

  const name = normalizeText(title.text());
  if (!name) {
    console.warn(`[paul-bassett] ${dpid} returned no menu name`);
    return null;
  }

  const menuId = randomUUID();
  const menu: CrawledMenu = {
    id: menuId,
    categoryId: category.id,
    name,
    description:
      normalizeText($(".menuTit dl dd").first().text()) || englishName || null,
    imageUrl: toAbsoluteImageUrl(
      $(".menu .slideArea .menuSlide img").first().attr("src"),
    ),
    allergens: normalizeAllergens(infoValue($, "알레르기 유발물질")),
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

export async function crawlPaulBassettMenus(): Promise<PaulBassettCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];
  const seen = new Set<string>();

  for (const category of PAUL_BASSETT_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[paul-bassett] ${category.id}`);
    const dpids = await fetchCategory(category);
    if (dpids.length === 0) {
      console.warn(`[paul-bassett] ${category.id} returned no menu data`);
      continue;
    }

    let sortOrder = 0;
    for (const dpid of dpids) {
      if (seen.has(dpid)) continue;
      seen.add(dpid);

      await sleep(REQUEST_DELAY_MS);
      const result = await crawlDetail(dpid, category, sortOrder);
      if (!result) continue;

      menus.push(result.menu);
      variants.push(...result.variants);
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
