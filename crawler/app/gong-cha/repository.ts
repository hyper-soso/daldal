import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  GONG_CHA_CAFE,
  GONG_CHA_CATEGORIES,
  GONG_CHA_ROOT_CATEGORIES,
} from "./cafe";
import { type GongChaCrawlResult } from "./types";

const GONG_CHA_CHILD_CATEGORIES = GONG_CHA_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceGongChaMenus({
  menus: newMenus,
  variants,
}: GongChaCrawlResult): Promise<void> {
  const categoryIds = GONG_CHA_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(GONG_CHA_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: GONG_CHA_CAFE.name,
          description: GONG_CHA_CAFE.description,
          logoUrl: GONG_CHA_CAFE.logoUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...GONG_CHA_ROOT_CATEGORIES,
      ...GONG_CHA_CHILD_CATEGORIES,
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
