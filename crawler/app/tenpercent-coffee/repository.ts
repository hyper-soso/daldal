import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  TENPERCENT_COFFEE_CAFE,
  TENPERCENT_COFFEE_CATEGORIES,
  TENPERCENT_COFFEE_ROOT_CATEGORIES,
} from "./cafe";
import { type TenpercentCoffeeCrawlResult } from "./types";

const TENPERCENT_COFFEE_CHILD_CATEGORIES = TENPERCENT_COFFEE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replaceTenpercentCoffeeMenus({
  menus: newMenus,
  variants,
}: TenpercentCoffeeCrawlResult): Promise<void> {
  const categoryIds = TENPERCENT_COFFEE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(TENPERCENT_COFFEE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: TENPERCENT_COFFEE_CAFE.name,
          description: TENPERCENT_COFFEE_CAFE.description,
          logoUrl: TENPERCENT_COFFEE_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...TENPERCENT_COFFEE_ROOT_CATEGORIES,
      ...TENPERCENT_COFFEE_CHILD_CATEGORIES,
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
