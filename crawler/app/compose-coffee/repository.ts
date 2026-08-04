import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  COMPOSE_COFFEE_CAFE,
  COMPOSE_COFFEE_CATEGORIES,
  COMPOSE_COFFEE_ROOT_CATEGORIES,
} from "./cafe";
import { type ComposeCoffeeCrawlResult } from "./types";

const COMPOSE_COFFEE_CHILD_CATEGORIES = COMPOSE_COFFEE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replaceComposeCoffeeMenus({
  menus: newMenus,
  variants,
}: ComposeCoffeeCrawlResult): Promise<void> {
  const categoryIds = COMPOSE_COFFEE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(COMPOSE_COFFEE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: COMPOSE_COFFEE_CAFE.name,
          description: COMPOSE_COFFEE_CAFE.description,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...COMPOSE_COFFEE_ROOT_CATEGORIES,
      ...COMPOSE_COFFEE_CHILD_CATEGORIES,
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
