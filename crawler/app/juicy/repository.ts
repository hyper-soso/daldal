import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { JUICY_CAFE, JUICY_CATEGORIES, JUICY_ROOT_CATEGORIES } from "./cafe";
import { type JuicyCrawlResult } from "./types";

const JUICY_CHILD_CATEGORIES = JUICY_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceJuicyMenus({
  menus: newMenus,
  variants,
}: JuicyCrawlResult): Promise<void> {
  const categoryIds = JUICY_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(JUICY_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: JUICY_CAFE.name,
          description: JUICY_CAFE.description,
          logoUrl: JUICY_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...JUICY_ROOT_CATEGORIES,
      ...JUICY_CHILD_CATEGORIES,
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
