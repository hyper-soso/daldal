import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  SULBING_CAFE,
  SULBING_CATEGORIES,
  SULBING_ROOT_CATEGORIES,
} from "./cafe";
import { type SulbingCrawlResult } from "./types";

const SULBING_CHILD_CATEGORIES = SULBING_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceSulbingMenus({
  menus: newMenus,
  variants,
}: SulbingCrawlResult): Promise<void> {
  const categoryIds = SULBING_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(SULBING_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: SULBING_CAFE.name,
          description: SULBING_CAFE.description,
          logoUrl: SULBING_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...SULBING_ROOT_CATEGORIES,
      ...SULBING_CHILD_CATEGORIES,
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
