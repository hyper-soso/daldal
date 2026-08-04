import { NextResponse } from "next/server";

import { MEGA_COFFEE_CAFE } from "./cafe";
import { crawlMegaCoffeeMenus } from "./crawler";
import { replaceMegaCoffeeMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[mega-coffee] crawling started");
    const result = await crawlMegaCoffeeMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Mega Coffee returned no menu data; database was not changed",
      );
    }

    await replaceMegaCoffeeMenus(result);
    console.log(
      `[mega-coffee] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: MEGA_COFFEE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[mega-coffee] crawling failed", error);

    return NextResponse.json(
      {
        cafe: MEGA_COFFEE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
