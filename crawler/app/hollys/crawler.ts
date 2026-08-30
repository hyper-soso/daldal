import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { HOLLYS_CATEGORIES, type HollysCategory } from "./cafe";
import { type CrawledMenu, type HollysCrawlResult } from "./types";
import {
  normalizeAllergens,
  normalizeNutritionLabel,
  normalizeText,
  parseNumber,
  parseServingSize,
  toAbsoluteImageUrl,
} from "./utils";

const MENU_ORIGIN = "https://www.hollys.co.kr/menu";
const REQUEST_DELAY_MS = 200;

type CheerioApi = ReturnType<typeof cheerio.load>;
type CheerioItem = ReturnType<CheerioApi>;

async function fetchCategory(category: HollysCategory): Promise<string> {
  const response = await fetch(`${MENU_ORIGIN}/${category.path}.do`, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DaldalCrawler/1.0)" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Hollys category ${category.id}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

/**
 * 음료는 thead 첫 칸이 비어 있고 tbody 행이 `th`(HOT/ICED)로 시작한다.
 * 푸드는 thead 첫 칸부터 영양성분이라 행에 `th`가 없다.
 * 두 경우 모두 뒤에서부터 맞추면 라벨이 정렬된다.
 */
function createVariants(
  $: CheerioApi,
  info: CheerioItem,
  menuId: string,
): NewMenuVariant[] {
  const headers = info
    .find("table thead th")
    .toArray()
    .map((element) => normalizeNutritionLabel($(element).text()));
  const serving = parseServingSize(info.find(".tableInfo03").text());

  return info
    .find("table tbody tr")
    .toArray()
    .map((row, sortOrder) => {
      const cells = $(row)
        .find("td")
        .toArray()
        .map((cell) => normalizeText($(cell).text()));
      const labels = headers.slice(headers.length - cells.length);
      const valueOf = (label: string): number | null => {
        const index = labels.indexOf(label);
        return index >= 0 ? parseNumber(cells[index]) : null;
      };
      const variantName = normalizeText($(row).find("th").first().text());

      return {
        menuId,
        name: variantName || "기본",
        size: serving.size,
        unit: serving.unit,
        price: null,
        calories: valueOf("칼로리"),
        fat: null,
        saturatedFat: valueOf("포화지방"),
        sugars: valueOf("당류"),
        sodium: valueOf("나트륨"),
        protein: valueOf("단백질"),
        caffeine: valueOf("카페인"),
        carbohydrate: null,
        isDefault: sortOrder === 0,
        sortOrder,
      } satisfies NewMenuVariant;
    })
    .filter((variant) => variant.calories !== null || variant.name !== "기본");
}

export async function crawlHollysMenus(): Promise<HollysCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of HOLLYS_CATEGORIES) {
    if (menus.length > 0) await sleep(REQUEST_DELAY_MS);

    console.log(`[hollys] ${category.id}`);
    const $ = cheerio.load(await fetchCategory(category));
    const details = $(".menu_view01").toArray();

    if (details.length === 0) {
      throw new Error(`Hollys category ${category.id} returned no menu data`);
    }

    let sortOrder = 0;
    for (const element of details) {
      const detail = $(element);
      const menuCode = (detail.attr("id") ?? "").replace("menuView1_", "");
      const title = detail.find(".menu_detail p").first();
      const name = normalizeText(title.find("span").first().text());
      if (!menuCode || !name) continue;

      const nameWithoutKorean = title.clone();
      nameWithoutKorean.find("span").remove();

      const description =
        normalizeText(detail.find(".menu_info").first().text()) ||
        normalizeText(nameWithoutKorean.text()) ||
        null;
      const info = $(`#menuView2_${menuCode}`).first();
      const menu: CrawledMenu = {
        id: randomUUID(),
        categoryId: category.id,
        name,
        description,
        imageUrl: toAbsoluteImageUrl(detail.find("img").first().attr("src")),
        allergens: normalizeAllergens(info.find(".allergy_item").text()),
        sortOrder,
      };

      const menuVariants = createVariants($, info, menu.id);
      menus.push(menu);
      variants.push(
        ...(menuVariants.length > 0
          ? menuVariants
          : [
              {
                menuId: menu.id,
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
              } satisfies NewMenuVariant,
            ]),
      );
      sortOrder += 1;
    }
  }

  return { menus, variants };
}
