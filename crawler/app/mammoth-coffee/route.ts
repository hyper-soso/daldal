import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { MAMMOTH_COFFEE_CAFE } from "./cafe";
import { crawlMammothCoffeeMenus } from "./crawler";
import { replaceMammothCoffeeMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[mammoth-coffee] crawling started");
    const result = await crawlMammothCoffeeMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Mammoth Coffee returned no menu data; database was not changed",
      );
    }

    await replaceMammothCoffeeMenus(result);

    await refreshWebReadModel();
    console.log(
      `[mammoth-coffee] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: MAMMOTH_COFFEE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[mammoth-coffee] crawling failed", error);

    return NextResponse.json(
      {
        cafe: MAMMOTH_COFFEE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
