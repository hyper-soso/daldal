import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const globalForDb = globalThis as typeof globalThis & {
  crawlerPool?: Pool;
};

export const pool =
  globalForDb.crawlerPool ??
  new Pool({
    connectionString,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.crawlerPool = pool;
}

export const db = drizzle({ client: pool, schema });
