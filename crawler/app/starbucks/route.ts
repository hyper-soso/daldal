import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { STARBUCKS_CAFE } from "./cafe";
import { crawlStarbucksMenus } from "./crawler";
import { replaceStarbucksMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[starbucks] crawling started");
    const result = await crawlStarbucksMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("Starbucks returned no menu data; database was not changed");
    }

    await replaceStarbucksMenus(result);

    await refreshWebReadModel();
    console.log(
      `[starbucks] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: STARBUCKS_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[starbucks] crawling failed", error);

    return NextResponse.json(
      {
        cafe: STARBUCKS_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
