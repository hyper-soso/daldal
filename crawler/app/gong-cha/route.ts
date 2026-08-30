import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { GONG_CHA_CAFE } from "./cafe";
import { crawlGongChaMenus } from "./crawler";
import { replaceGongChaMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[gong-cha] crawling started");
    const result = await crawlGongChaMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Gong Cha returned no menu data; database was not changed",
      );
    }

    await replaceGongChaMenus(result);

    await refreshWebReadModel();
    console.log(
      `[gong-cha] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: GONG_CHA_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[gong-cha] crawling failed", error);

    return NextResponse.json(
      {
        cafe: GONG_CHA_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
