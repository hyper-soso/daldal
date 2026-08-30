import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { BANAPRESSO_CAFE } from "./cafe";
import { crawlBanapressoMenus } from "./crawler";
import { replaceBanapressoMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[banapresso] crawling started");
    const result = await crawlBanapressoMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Banapresso returned no menu data; database was not changed",
      );
    }

    await replaceBanapressoMenus(result);

    await refreshWebReadModel();
    console.log(
      `[banapresso] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: BANAPRESSO_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[banapresso] crawling failed", error);

    return NextResponse.json(
      {
        cafe: BANAPRESSO_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
