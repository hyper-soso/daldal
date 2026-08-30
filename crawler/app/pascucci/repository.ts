import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  PASCUCCI_CAFE,
  PASCUCCI_CATEGORIES,
  PASCUCCI_ROOT_CATEGORIES,
} from "./cafe";
import { type PascucciCrawlResult } from "./types";

const PASCUCCI_CHILD_CATEGORIES = PASCUCCI_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replacePascucciMenus({
  menus: newMenus,
  variants,
}: PascucciCrawlResult): Promise<void> {
  const categoryIds = PASCUCCI_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(PASCUCCI_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: PASCUCCI_CAFE.name,
          description: PASCUCCI_CAFE.description,
          logoUrl: PASCUCCI_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...PASCUCCI_ROOT_CATEGORIES,
      ...PASCUCCI_CHILD_CATEGORIES,
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
