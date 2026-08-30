import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { THE_VENTI_CAFE } from "./cafe";
import { crawlTheVentiMenus } from "./crawler";
import { replaceTheVentiMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[the-venti] crawling started");
    const result = await crawlTheVentiMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error("The Venti returned no menu data; database was not changed");
    }

    await replaceTheVentiMenus(result);

    await refreshWebReadModel();
    console.log(
      `[the-venti] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: THE_VENTI_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[the-venti] crawling failed", error);

    return NextResponse.json(
      {
        cafe: THE_VENTI_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
