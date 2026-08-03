import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.execute(
      sql<{ database: string; serverTime: Date }>`
        select
          current_database() as database,
          now() as "serverTime"
      `,
    );

    return NextResponse.json({
      cafe: "starbucks",
      database: "connected",
      connection: result.rows[0],
    });
  } catch (error) {
    console.error("[starbucks] database query failed", error);

    return NextResponse.json(
      {
        cafe: "starbucks",
        database: "error",
        message: "Database query failed",
      },
      { status: 500 },
    );
  }
}
