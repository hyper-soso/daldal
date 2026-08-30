import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { EDIYA_CAFE } from "./cafe";
import { crawlEdiyaMenus } from "./crawler";
import { replaceEdiyaMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[ediya] crawling started");
    const result = await crawlEdiyaMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("EDIYA returned no menu data; database was not changed");
    }

    await replaceEdiyaMenus(result);

    await refreshWebReadModel();
    console.log(
      `[ediya] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: EDIYA_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[ediya] crawling failed", error);

    return NextResponse.json(
      {
        cafe: EDIYA_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
