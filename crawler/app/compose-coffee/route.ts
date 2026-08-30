import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { COMPOSE_COFFEE_CAFE } from "./cafe";
import { crawlComposeCoffeeMenus } from "./crawler";
import { replaceComposeCoffeeMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[compose-coffee] crawling started");
    const result = await crawlComposeCoffeeMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Compose Coffee returned no menu data; database was not changed",
      );
    }

    await replaceComposeCoffeeMenus(result);

    await refreshWebReadModel();
    console.log(
      `[compose-coffee] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: COMPOSE_COFFEE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[compose-coffee] crawling failed", error);

    return NextResponse.json(
      {
        cafe: COMPOSE_COFFEE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
