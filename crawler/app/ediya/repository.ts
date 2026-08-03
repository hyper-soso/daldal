import { inArray } from "drizzle-orm";

import { cafeCategories, cafes, menus, menuVariants } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  EDIYA_CAFE,
  EDIYA_CATEGORIES,
  EDIYA_ROOT_CATEGORIES,
} from "./cafe";
import { type EdiyaCrawlResult } from "./types";

const EDIYA_CHILD_CATEGORIES = EDIYA_CATEGORIES.map((category) => ({
  id: category.id,
  cafeId: category.cafeId,
  parentId: category.parentId,
  name: category.name,
  sortOrder: category.sortOrder,
  isVisible: category.isVisible,
}));

export async function replaceEdiyaMenus({
  menus: newMenus,
  variants,
}: EdiyaCrawlResult): Promise<void> {
  const categoryIds = EDIYA_CHILD_CATEGORIES.map((category) => category.id);

  await db.transaction(async (tx) => {
    await tx
      .insert(cafes)
      .values(EDIYA_CAFE)
      .onConflictDoUpdate({
        target: cafes.id,
        set: {
          name: EDIYA_CAFE.name,
          description: EDIYA_CAFE.description,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    for (const category of [
      ...EDIYA_ROOT_CATEGORIES,
      ...EDIYA_CHILD_CATEGORIES,
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
