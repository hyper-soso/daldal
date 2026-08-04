import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  MEGA_COFFEE_CAFE,
  MEGA_COFFEE_CATEGORIES,
  MEGA_COFFEE_ROOT_CATEGORIES,
} from "./cafe";
import { type MegaCoffeeCrawlResult } from "./types";

const MEGA_COFFEE_CHILD_CATEGORIES = MEGA_COFFEE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replaceMegaCoffeeMenus({
  menus: newMenus,
  variants,
}: MegaCoffeeCrawlResult): Promise<void> {
  const categoryIds = MEGA_COFFEE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(MEGA_COFFEE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: MEGA_COFFEE_CAFE.name,
          description: MEGA_COFFEE_CAFE.description,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...MEGA_COFFEE_ROOT_CATEGORIES,
      ...MEGA_COFFEE_CHILD_CATEGORIES,
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
