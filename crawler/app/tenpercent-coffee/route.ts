import { NextResponse } from "next/server";

import { refreshWebReadModel } from "@/lib/read-model";

import { TENPERCENT_COFFEE_CAFE } from "./cafe";
import { crawlTenpercentCoffeeMenus } from "./crawler";
import { replaceTenpercentCoffeeMenus } from "./repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("[tenpercent-coffee] crawling started");
    const result = await crawlTenpercentCoffeeMenus();

    if (result.menus.length === 0 || result.variants.length === 0) {
      throw new Error(
        "Tenpercent Coffee returned no menu data; database was not changed",
      );
    }

    await replaceTenpercentCoffeeMenus(result);

    await refreshWebReadModel();
    console.log(
      `[tenpercent-coffee] saved ${result.menus.length} menus and ${result.variants.length} variants`,
    );

    return NextResponse.json({
      cafe: TENPERCENT_COFFEE_CAFE.id,
      menus: result.menus.length,
      variants: result.variants.length,
    });
  } catch (error) {
    console.error("[tenpercent-coffee] crawling failed", error);

    return NextResponse.json(
      {
        cafe: TENPERCENT_COFFEE_CAFE.id,
        message:
          error instanceof Error ? error.message : "Unknown crawling error",
      },
      { status: 500 },
    );
  }
}
