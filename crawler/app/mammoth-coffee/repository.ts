import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  MAMMOTH_COFFEE_CAFE,
  MAMMOTH_COFFEE_CATEGORIES,
  MAMMOTH_COFFEE_ROOT_CATEGORIES,
} from "./cafe";
import { type MammothCoffeeCrawlResult } from "./types";

const MAMMOTH_COFFEE_CHILD_CATEGORIES = MAMMOTH_COFFEE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replaceMammothCoffeeMenus({
  menus: newMenus,
  variants,
}: MammothCoffeeCrawlResult): Promise<void> {
  const categoryIds = MAMMOTH_COFFEE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(MAMMOTH_COFFEE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: MAMMOTH_COFFEE_CAFE.name,
          description: MAMMOTH_COFFEE_CAFE.description,
          logoUrl: MAMMOTH_COFFEE_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...MAMMOTH_COFFEE_ROOT_CATEGORIES,
      ...MAMMOTH_COFFEE_CHILD_CATEGORIES,
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
