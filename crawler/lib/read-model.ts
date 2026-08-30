import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

/**
 * web 앱이 조회하는 평면 테이블(cafes / categories / menus)을
 * 정규화 테이블(cafe / cafe_category / menu / menu_variant)에서 다시 채운다.
 *
 * 크롤링으로 menu / menu_variant 를 교체한 뒤 반드시 호출해야
 * 웹에 새 데이터가 반영된다.
 */
export async function refreshWebReadModel(): Promise<void> {
  await db.execute(sql`select refresh_web_read_model()`);
}
