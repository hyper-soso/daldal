import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * 마이그레이션은 session-mode 풀러(DIRECT_URL)로 실행한다.
 * transaction-mode 풀러(DATABASE_URL)는 DDL에 필요한 세션 상태를 유지하지 못한다.
 */
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL is not configured");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: migrationUrl,
  },
  strict: true,
  verbose: true,
});
