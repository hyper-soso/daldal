import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type HollysCategory = NewCafeCategory & {
  path: string;
};

export const HOLLYS_CAFE: NewCafe = {
  id: "hollys",
  name: "할리스",
  description: "HOLLYS",
  logoUrl: "/logos/hollys.png",
  isActive: true,
};

export const HOLLYS_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "hollys-beverage",
    cafeId: HOLLYS_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "hollys-food",
    cafeId: HOLLYS_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

const beverageCategory = (
  id: string,
  name: string,
  sortOrder: number,
  path: string,
): HollysCategory => ({
  id: `hollys-beverage-${id}`,
  cafeId: HOLLYS_CAFE.id,
  parentId: "hollys-beverage",
  name,
  sortOrder,
  isVisible: true,
  path,
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  path: string,
): HollysCategory => ({
  id: `hollys-food-${id}`,
  cafeId: HOLLYS_CAFE.id,
  parentId: "hollys-food",
  name,
  sortOrder,
  isVisible: true,
  path,
});

export const HOLLYS_CATEGORIES: HollysCategory[] = [
  beverageCategory("coffee", "COFFEE", 0, "espresso"),
  beverageCategory("signature", "라떼 · 초콜릿 · 티", 1, "signature"),
  beverageCategory("hollyccino", "할리치노 · 빙수", 2, "hollyccino"),
  beverageCategory("juice", "스무디 · 주스", 3, "juice"),
  beverageCategory("sparkling", "스파클링", 4, "tea"),
  foodCategory("bakery", "푸드", 0, "bakery"),
  foodCategory("md", "MD식품", 1, "bean"),
];
