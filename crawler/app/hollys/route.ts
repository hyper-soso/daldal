import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { HOLLYS_CAFE } from "./cafe";
import { crawlHollysMenus } from "./crawler";
import { replaceHollysMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[hollys] crawling started");
    const result = await crawlHollysMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("Hollys returned no menu data; database was not changed");
    }

    await replaceHollysMenus(result);

    await refreshWebReadModel();
    console.log(
      `[hollys] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: HOLLYS_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[hollys] crawling failed", error);

    return NextResponse.json(
      {
        cafe: HOLLYS_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
