import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { SULBING_CAFE } from "./cafe";
import { crawlSulbingMenus } from "./crawler";
import { replaceSulbingMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[sulbing] crawling started");
    const result = await crawlSulbingMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("Sulbing returned no menu data; database was not changed");
    }

    await replaceSulbingMenus(result);

    await refreshWebReadModel();
    console.log(
      `[sulbing] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: SULBING_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[sulbing] crawling failed", error);

    return NextResponse.json(
      {
        cafe: SULBING_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
