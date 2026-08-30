import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  BANAPRESSO_CAFE,
  BANAPRESSO_CATEGORIES,
  BANAPRESSO_ROOT_CATEGORIES,
} from "./cafe";
import { type BanapressoCrawlResult } from "./types";

const BANAPRESSO_CHILD_CATEGORIES = BANAPRESSO_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceBanapressoMenus({
  menus: newMenus,
  variants,
}: BanapressoCrawlResult): Promise<void> {
  const categoryIds = BANAPRESSO_CHILD_CATEGORIES.map(
    (category) => category.id,
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(BANAPRESSO_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: BANAPRESSO_CAFE.name,
          description: BANAPRESSO_CAFE.description,
          logoUrl: BANAPRESSO_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...BANAPRESSO_ROOT_CATEGORIES,
      ...BANAPRESSO_CHILD_CATEGORIES,
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
