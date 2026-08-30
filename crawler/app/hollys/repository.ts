import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { HOLLYS_CAFE, HOLLYS_CATEGORIES, HOLLYS_ROOT_CATEGORIES } from "./cafe";
import { type HollysCrawlResult } from "./types";

const HOLLYS_CHILD_CATEGORIES = HOLLYS_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceHollysMenus({
  menus: newMenus,
  variants,
}: HollysCrawlResult): Promise<void> {
  const categoryIds = HOLLYS_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(HOLLYS_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: HOLLYS_CAFE.name,
          description: HOLLYS_CAFE.description,
          logoUrl: HOLLYS_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...HOLLYS_ROOT_CATEGORIES,
      ...HOLLYS_CHILD_CATEGORIES,
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
