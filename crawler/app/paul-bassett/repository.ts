import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  PAUL_BASSETT_CAFE,
  PAUL_BASSETT_CATEGORIES,
  PAUL_BASSETT_ROOT_CATEGORIES,
} from "./cafe";
import { type PaulBassettCrawlResult } from "./types";

const PAUL_BASSETT_CHILD_CATEGORIES = PAUL_BASSETT_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replacePaulBassettMenus({
  menus: newMenus,
  variants,
}: PaulBassettCrawlResult): Promise<void> {
  const categoryIds = PAUL_BASSETT_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(PAUL_BASSETT_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: PAUL_BASSETT_CAFE.name,
          description: PAUL_BASSETT_CAFE.description,
          logoUrl: PAUL_BASSETT_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...PAUL_BASSETT_ROOT_CATEGORIES,
      ...PAUL_BASSETT_CHILD_CATEGORIES,
    ]) {
      await tx
        .insert(cafeCategories)
        .values(category)
        .onConflictDoUpdate({
          target: cafeCategories.id,
          set: {
            cafeId: category.cafeId,
            parentId: category.parentId,
            name: category.name,
            sortOrder: category.sortOrder,
            isVisible: category.isVisible,
            updatedAt: new Date(),
          },
        });
    }

    await tx.delete(menus).where(inArray(menus.categoryId, categoryIds));
    await tx.insert(menus).values(newMenus);
    await tx.insert(menuVariants).values(variants);
  });
}
