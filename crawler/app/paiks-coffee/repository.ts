import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  PAIKS_COFFEE_CAFE,
  PAIKS_COFFEE_CATEGORIES,
  PAIKS_COFFEE_ROOT_CATEGORIES,
} from "./cafe";
import { type PaiksCoffeeCrawlResult } from "./types";

const PAIKS_COFFEE_CHILD_CATEGORIES = PAIKS_COFFEE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replacePaiksCoffeeMenus({
  menus: newMenus,
  variants,
}: PaiksCoffeeCrawlResult): Promise<void> {
  const categoryIds = PAIKS_COFFEE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(PAIKS_COFFEE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: PAIKS_COFFEE_CAFE.name,
          description: PAIKS_COFFEE_CAFE.description,
          logoUrl: PAIKS_COFFEE_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...PAIKS_COFFEE_ROOT_CATEGORIES,
      ...PAIKS_COFFEE_CHILD_CATEGORIES,
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
