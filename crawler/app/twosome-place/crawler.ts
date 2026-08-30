import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { TWOSOME_PLACE_CATEGORIES, type TwosomePlaceCategory } from "./cafe";
import { type CrawledMenu, type TwosomePlaceCrawlResult } from "./types";
import {
  normalizeAllergens,
  normalizeText,
  parseNutritionValue,
  parseServingSize,
  stripHtml,
  toImageUrl,
  toNullableString,
} from "./utils";

const MENU_ORIGIN = "https://mo.twosome.co.kr/mn";
const MAX_PAGE = 50;
const REQUEST_DELAY_MS = 80;

type TwosomeItem = Record<string, unknown>;
type Nutrition = Map<string, string>;

function isRecord(value: unknown): value is TwosomeItem {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function post(path: string, body: Record<string, string>) {
  const response = await fetch(`${MENU_ORIGIN}/${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)",
      Referer: `${MENU_ORIGIN}/menuInfoList.do`,
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch A Twosome Place ${path}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<unknown>;
}

async function fetchCategory(
  category: TwosomePlaceCategory,
): Promise<TwosomeItem[]> {
  const items: TwosomeItem[] = [];

  for (let page = 1; page <= MAX_PAGE; page += 1) {
    if (page > 1) await sleep(REQUEST_DELAY_MS);

    const data = await post("menuInfoListAjax.json", {
      pageNum: String(page),
      grtCd: category.topCode,
      midCd: category.code,
    });
    if (!isRecord(data) || !Array.isArray(data.fetchResultListSet)) {
      throw new Error(
        `A Twosome Place category ${category.id} returned invalid JSON`,
      );
    }

    const rows = data.fetchResultListSet.filter(isRecord);
    items.push(...rows);

    const nextPage = Number(rows[0]?.NEXT_PAGE ?? 0);
    if (rows.length === 0 || !Number.isFinite(nextPage) || nextPage <= page) {
      break;
    }
  }

  return items;
}

async function fetchNutrition(
  menuCode: string,
  category: TwosomePlaceCategory,
  ondoOpt: string,
  sizeOpt: string,
): Promise<Nutrition> {
  const data = await post("menuAddInfoCntnListAjax.json", {
    menuCd: menuCode,
    ondoOpt,
    sizeOpt,
    midCd: category.code,
  });

  const nutrition: Nutrition = new Map();
  if (!Array.isArray(data)) return nutrition;

  for (const row of data.filter(isRecord)) {
    const title = toNullableString(row.ADD_INFO_TITLE);
    const content = toNullableString(row.MENU_CNTNT);
    if (title && content) nutrition.set(title, content);
  }

  return nutrition;
}

function createVariant(
  menuId: string,
  name: string,
  nutrition: Nutrition,
  sortOrder: number,
): NewMenuVariant {
  const serving =
    parseServingSize(nutrition.get("1회 제공량")).size !== null
      ? parseServingSize(nutrition.get("1회 제공량"))
      : parseServingSize(nutrition.get("총 제공량"));

  return {
    menuId,
    name: name || "기본",
    size: serving.size,
    unit: serving.unit,
    price: null,
    calories: parseNutritionValue(nutrition.get("열량(Kcal)")),
    fat: null,
    saturatedFat: parseNutritionValue(nutrition.get("포화지방(g/%)")),
    sugars: parseNutritionValue(nutrition.get("당류(g/%)")),
    sodium: parseNutritionValue(nutrition.get("나트륨(mg/%)")),
    protein: parseNutritionValue(nutrition.get("단백질(g/%)")),
    caffeine: parseNutritionValue(nutrition.get("카페인(mg/%)")),
    carbohydrate: parseNutritionValue(nutrition.get("탄수화물(g/%)")),
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

async function crawlDetail(
  listItem: TwosomeItem,
  category: TwosomePlaceCategory,
  sortOrder: number,
): Promise<{ menu: CrawledMenu; variants: NewMenuVariant[] } | null> {
  const menuCode = toNullableString(listItem.MENU_CD);
  const name = toNullableString(listItem.MENU_NM);
  if (!menuCode || !name) return null;

  const url = new URL(`${MENU_ORIGIN}/menuInfoDetail.do`);
  url.searchParams.set("menuCd", menuCode);

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch A Twosome Place menu ${menuCode}: ${response.status} ${response.statusText}`,
    );
  }

  const $ = cheerio.load(await response.text());
  const menuId = randomUUID();
  const menu: CrawledMenu = {
    id: menuId,
    categoryId: category.id,
    name,
    /** 설명은 `p.desc` 안에 `p`가 중첩돼 있어 `dd` 전체를 텍스트로 편다. */
    description:
      stripHtml($(".menu-detail-info-title dd").first().html() ?? "") ||
      toNullableString(listItem.EN_MENU_NM),
    imageUrl: toImageUrl(listItem.MENU_IMG_01 ?? listItem.MENU_IMG),
    allergens: normalizeAllergens($(".info_allergy .contents").first().text()),
    sortOrder,
  };

  /** 음료는 온도 탭이 있고, 온도마다 선택 가능한 사이즈가 다르다. */
  const temperatures = $("a[id^='ondo_']")
    .toArray()
    .map((element) => ({
      code: ($(element).attr("id") ?? "").replace("ondo_", ""),
      name: normalizeText($(element).text()),
    }))
    .filter((temperature, index, list) => {
      return (
        temperature.code &&
        list.findIndex((item) => item.code === temperature.code) === index
      );
    });

  const variants: NewMenuVariant[] = [];

  for (const temperature of temperatures) {
    await sleep(REQUEST_DELAY_MS);
    const sizes = await post("menuSizeOptListAjax.json", {
      menuCd: menuCode,
      ondoOpt: temperature.code,
      midCd: category.code,
    });

    for (const size of Array.isArray(sizes) ? sizes.filter(isRecord) : []) {
      const sizeOpt = toNullableString(size.OPTS);
      if (!sizeOpt) continue;

      await sleep(REQUEST_DELAY_MS);
      const nutrition = await fetchNutrition(
        menuCode,
        category,
        temperature.code,
        sizeOpt,
      );
      if (nutrition.size === 0) continue;

      const sizeName = toNullableString(size.SIZE_OPT_NM);
      variants.push(
        createVariant(
          menuId,
          [temperature.name, sizeName].filter(Boolean).join(" "),
          nutrition,
          variants.length,
        ),
      );
    }
  }

  /** 푸드는 온도/사이즈 선택이 없어 상세 페이지에 영양정보가 그대로 있다. */
  if (variants.length === 0) {
    const nutrition: Nutrition = new Map();
    $(".text_list_ts24_type02")
      .first()
      .find("li")
      .each((_, element) => {
        const label = normalizeText($(element).find(".label").text());
        const value = normalizeText($(element).find(".value").text());
        if (label && value) nutrition.set(label, value);
      });

    variants.push(createVariant(menuId, "기본", nutrition, 0));
  }

  return { menu, variants };
}

export async function crawlTwosomePlaceMenus(): Promise<TwosomePlaceCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of TWOSOME_PLACE_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[twosome-place] ${category.id}`);
    const items = await fetchCategory(category);
    if (items.length === 0) {
      throw new Error(
        `A Twosome Place category ${category.id} returned no menu data`,
      );
    }

    let sortOrder = 0;
    for (const item of items) {
      await sleep(REQUEST_DELAY_MS);
      const result = await crawlDetail(item, category, sortOrder);
      if (!result) continue;

      menus.push(result.menu);
      variants.push(...result.variants);
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
