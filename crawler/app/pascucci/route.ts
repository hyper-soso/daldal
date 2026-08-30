import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { PASCUCCI_CAFE } from "./cafe";
import { crawlPascucciMenus } from "./crawler";
import { replacePascucciMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[pascucci] crawling started");
    const result = await crawlPascucciMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("Pascucci returned no menu data; database was not changed");
    }

    await replacePascucciMenus(result);

    await refreshWebReadModel();
    console.log(
      `[pascucci] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: PASCUCCI_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[pascucci] crawling failed", error);

    return NextResponse.json(
      {
        cafe: PASCUCCI_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
