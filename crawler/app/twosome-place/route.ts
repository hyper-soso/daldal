import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { TWOSOME_PLACE_CAFE } from "./cafe";
import { crawlTwosomePlaceMenus } from "./crawler";
import { replaceTwosomePlaceMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[twosome-place] crawling started");
    const result = await crawlTwosomePlaceMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "A Twosome Place returned no menu data; database was not changed",
      );
    }

    await replaceTwosomePlaceMenus(result);

    await refreshWebReadModel();
    console.log(
      `[twosome-place] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: TWOSOME_PLACE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[twosome-place] crawling failed", error);

    return NextResponse.json(
      {
        cafe: TWOSOME_PLACE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
