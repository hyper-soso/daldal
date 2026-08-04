import { NextResponse } from "next/server";

import { PAIKS_COFFEE_CAFE } from "./cafe";
import { crawlPaiksCoffeeMenus } from "./crawler";
import { replacePaiksCoffeeMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[paiks-coffee] crawling started");
    const result = await crawlPaiksCoffeeMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Paik's Coffee returned no menu data; database was not changed",
      );
    }

    await replacePaiksCoffeeMenus(result);
    console.log(
      `[paiks-coffee] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: PAIKS_COFFEE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[paiks-coffee] crawling failed", error);

    return NextResponse.json(
      {
        cafe: PAIKS_COFFEE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
