import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { JUICY_CAFE } from "./cafe";
import { crawlJuicyMenus } from "./crawler";
import { replaceJuicyMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[juicy] crawling started");
    const result = await crawlJuicyMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("Juicy returned no menu data; database was not changed");
    }

    await replaceJuicyMenus(result);

    await refreshWebReadModel();
    console.log(
      `[juicy] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: JUICY_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[juicy] crawling failed", error);

    return NextResponse.json(
      {
        cafe: JUICY_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
