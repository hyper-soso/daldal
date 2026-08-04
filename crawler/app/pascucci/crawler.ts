import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";

import { type NewMenuVariant } from "@/drizzle/schema";
import { sleep } from "@/lib/utils";
import { PASCUCCI_CATEGORIES, type PascucciSource } from "./cafe";
import { type CrawledMenu, type PascucciCrawlResult } from "./types";
import {
  normalizeText,
  parseAllergens,
  parseNumber,
  splitTemperatureName,
  toAbsoluteUrl,
} from "./utils";

const LIST_URL = "https://www.pascucci.co.kr/product/productList.asp";
const DETAIL_URL =
  "https://www.pascucci.co.kr/product/ajax/productDetail.asp";
const REQUEST_DELAY_MS = 75;

type ParsedVariant = {
  name: string;
  price: number | null;
  size: number | null;
  unit: string | null;
  calories: number | null;
  sugars: number | null;
  protein: number | null;
  saturatedFat: number | null;
  fat: number | null;
  sodium: number | null;
  caffeine: number | null;
  carbohydrate: number | null;
  allergens: string | null;
};

type ProductDetail = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  variants: ParsedVariant[];
};

async function fetchList(source: PascucciSource): Promise<string[]> {
  const url = new URL(LIST_URL);
  url.searchParams.set("typeCode", source.code);
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pascucci category ${source.code}: ${response.status} ${response.statusText}`,
    );
  }

  const $ = cheerio.load(await response.text());
  return $("a.product[data-productseq]")
    .toArray()
    .map((element) => $(element).attr("data-productseq"))
    .filter((productSeq): productSeq is string => Boolean(productSeq));
}

function parsePriceMap(
  $: ReturnType<typeof cheerio.load>,
): Map<string, number> {
  const prices = new Map<string, number>();

  $(".sizeInfo span").each((_, element) => {
    const text = normalizeText($(element).text());
    const match = text.match(/^(.+?)\s+([\d,]+)원$/);
    if (match) {
      prices.set(
        match[1].toUpperCase(),
        Number(match[2].replace(/,/g, "")),
      );
      return;
    }

    const singlePrice = text.match(/^([\d,]+)원$/);
    if (singlePrice) {
      prices.set("기본", Number(singlePrice[1].replace(/,/g, "")));
    }
  });
  return prices;
}

function parseNutritionList(html: string, name: string): ParsedVariant {
  const $ = cheerio.load(`<ul>${html}</ul>`);
  const fields = new Map<string, { value: string; unit: string | null }>();

  $("li").each((_, element) => {
    const item = $(element);
    const valueElement = item.find("p").first();
    const unit = normalizeText(valueElement.find("small").text()).toLowerCase();
    const rawValue = normalizeText(
      valueElement.clone().find("small").remove().end().text(),
    );
    fields.set(normalizeText(item.find("span").text()), {
      value: rawValue,
      unit: unit || null,
    });
  });

  const field = (...labels: string[]) => {
    for (const label of labels) {
      const found = fields.get(label);
      if (found) return found;
    }
    return { value: "", unit: null };
  };
  const size = field("총 내용량");

  return {
    name,
    price: null,
    size: parseNumber(size.value),
    unit: size.unit,
    calories: parseNumber(field("kcal").value),
    sugars: parseNumber(field("당", "당류").value),
    protein: parseNumber(field("단백질").value),
    saturatedFat: parseNumber(field("포화지방").value),
    fat: parseNumber(field("지방", "총지방").value),
    sodium: parseNumber(field("나트륨").value),
    caffeine: parseNumber(field("카페인").value),
    carbohydrate: parseNumber(field("탄수화물").value),
    allergens: parseAllergens(
      field("알러지 유발성분", "알레르기 유발성분").value,
    ),
  };
}

function parseScriptVariants(
  $: ReturnType<typeof cheerio.load>,
  availableSizeNames: Set<string>,
): ParsedVariant[] {
  const script = $("script")
    .toArray()
    .map((element) => $(element).html() ?? "")
    .find((text) => text.includes("#sizeGubun") && text.includes("nutriHtml"));
  if (!script) return [];

  const variants: ParsedVariant[] = [];
  const branchPattern =
    /(?:if|else if)\s*\(\$\(this\)\.val\(\)\s*==\s*"([^"]+)"\)\s*\{([\s\S]*?)(?=\}\s*else if|\}\s*else\s*\{)/g;

  for (const branch of script.matchAll(branchPattern)) {
    const sizeName = branch[1].toUpperCase();
    if (!availableSizeNames.has(sizeName)) continue;

    const fragments = [
      ...branch[2].matchAll(
        /nutriHtml\s*\+=\s*"([^"]*)"|\+\s*"([^"]*)"/g,
      ),
    ]
      .map((match) => match[1] ?? match[2] ?? "")
      .join("");
    variants.push(parseNutritionList(fragments, sizeName));
  }
  return variants;
}

async function fetchDetail(productSeq: string): Promise<ProductDetail> {
  const response = await fetch(DETAIL_URL, {
    method: "POST",
    cache: "no-store",
    body: new URLSearchParams({ productSeq }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pascucci menu ${productSeq}: ${response.status} ${response.statusText}`,
    );
  }

  const $ = cheerio.load(await response.text());
  const root = $(".productDetail").first();
  if (root.length === 0) {
    throw new Error(`Pascucci menu ${productSeq} returned no detail data`);
  }

  const name = normalizeText(root.find("h1 strong").text());
  if (!name) throw new Error(`Pascucci menu ${productSeq} returned no name`);

  const prices = parsePriceMap($);
  const availableSizeNames = new Set(
    root
      .find("#sizeGubun option")
      .toArray()
      .map((element) => normalizeText($(element).attr("value") ?? ""))
      .filter(Boolean)
      .map((sizeName) => sizeName.toUpperCase()),
  );
  for (const sizeName of prices.keys()) availableSizeNames.add(sizeName);

  let variants = parseScriptVariants($, availableSizeNames);
  if (variants.length === 0) {
    const staticHtml = root.find("ul.nutri").first().html();
    if (staticHtml) variants = [parseNutritionList(staticHtml, "기본")];
  }
  if (variants.length === 0 && prices.size > 0) {
    variants = [...prices.keys()].map((sizeName) =>
      parseNutritionList("", sizeName),
    );
  }
  if (variants.length === 0) variants = [parseNutritionList("", "기본")];

  for (const variant of variants) {
    variant.price = prices.get(variant.name) ?? null;
  }

  return {
    name,
    description: normalizeText(root.find("p.desc").text()) || null,
    imageUrl: toAbsoluteUrl(root.find("img.proImg").attr("src")),
    variants,
  };
}

function toMenuVariant(
  menuId: string,
  variant: ParsedVariant,
  temperature: "HOT" | "ICED" | null,
  sortOrder: number,
): NewMenuVariant {
  const sizeName = variant.name === "기본" ? null : variant.name;
  return {
    menuId,
    name: [temperature, sizeName].filter(Boolean).join(" ") || "기본",
    size: variant.size,
    unit: variant.unit,
    price: variant.price,
    calories: variant.calories,
    fat: variant.fat,
    saturatedFat: variant.saturatedFat,
    sugars: variant.sugars,
    sodium: variant.sodium,
    protein: variant.protein,
    caffeine: variant.caffeine,
    carbohydrate: variant.carbohydrate,
    isDefault: sortOrder === 0,
    sortOrder,
  };
}

export async function crawlPascucciMenus(): Promise<PascucciCrawlResult> {
  const menus: CrawledMenu[] = [];
  const variants: NewMenuVariant[] = [];

  for (const category of PASCUCCI_CATEGORIES) {
    const categoryMenus = new Map<string, CrawledMenu>();
    const variantCounts = new Map<string, number>();

    for (const source of category.sources) {
      if (menus.length > 0) await sleep(REQUEST_DELAY_MS);
      console.log(`[pascucci] ${category.id}, ${source.code}`);
      const productSeqList = await fetchList(source);

      for (const productSeq of productSeqList) {
        await sleep(REQUEST_DELAY_MS);
        const detail = await fetchDetail(productSeq);
        const { menuName, temperature } = splitTemperatureName(
          detail.name,
          source.temperature,
        );

        let menu = categoryMenus.get(menuName);
        if (!menu) {
          menu = {
            id: randomUUID(),
            categoryId: category.id,
            name: menuName,
            description: detail.description,
            imageUrl: detail.imageUrl,
            allergens:
              detail.variants.find((variant) => variant.allergens)?.allergens ??
              null,
            sortOrder: categoryMenus.size,
          };
          categoryMenus.set(menuName, menu);
          menus.push(menu);
        } else {
          menu.description ??= detail.description;
          menu.imageUrl ??= detail.imageUrl;
          menu.allergens ??=
            detail.variants.find((variant) => variant.allergens)?.allergens ??
            null;
        }

        let sortOrder = variantCounts.get(menu.id) ?? 0;
        for (const variant of detail.variants) {
          variants.push(toMenuVariant(menu.id, variant, temperature, sortOrder));
          sortOrder += 1;
        }
        variantCounts.set(menu.id, sortOrder);
      }
    }

    if (categoryMenus.size === 0) {
      console.warn(`[pascucci] ${category.id} returned no menu data`);
    }
  }

  return { menus, variants };
}
