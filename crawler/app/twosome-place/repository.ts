import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  TWOSOME_PLACE_CAFE,
  TWOSOME_PLACE_CATEGORIES,
  TWOSOME_PLACE_ROOT_CATEGORIES,
} from "./cafe";
import { type TwosomePlaceCrawlResult } from "./types";

const TWOSOME_PLACE_CHILD_CATEGORIES = TWOSOME_PLACE_CATEGORIES.map(
  (category) => ({
    id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId,
    name: category.name,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }),
);

export async function replaceTwosomePlaceMenus({
  menus: newMenus,
  variants,
}: TwosomePlaceCrawlResult): Promise<void> {
  const categoryIds = TWOSOME_PLACE_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(TWOSOME_PLACE_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: TWOSOME_PLACE_CAFE.name,
          description: TWOSOME_PLACE_CAFE.description,
          logoUrl: TWOSOME_PLACE_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...TWOSOME_PLACE_ROOT_CATEGORIES,
      ...TWOSOME_PLACE_CHILD_CATEGORIES,
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
