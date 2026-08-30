import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { PAUL_BASSETT_CAFE } from "./cafe";
import { crawlPaulBassettMenus } from "./crawler";
import { replacePaulBassettMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[paul-bassett] crawling started");
    const result = await crawlPaulBassettMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Paul Bassett returned no menu data; database was not changed",
      );
    }

    await replacePaulBassettMenus(result);

    await refreshWebReadModel();
    console.log(
      `[paul-bassett] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: PAUL_BASSETT_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[paul-bassett] crawling failed", error);

    return NextResponse.json(
      {
        cafe: PAUL_BASSETT_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
