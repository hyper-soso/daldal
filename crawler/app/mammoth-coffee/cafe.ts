import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type MammothCoffeeCategory = NewCafeCategory & {
  code: string;
};

export const MAMMOTH_COFFEE_CAFE: NewCafe = {
  id: "mammoth-coffee",
  name: "매머드커피",
  description: "MAMMOTH COFFEE",
  logoUrl: "/logos/mammoth-coffee.svg",
  isActive: true,
};

export const MAMMOTH_COFFEE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "mammoth-coffee-beverage",
    cafeId: MAMMOTH_COFFEE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "mammoth-coffee-food",
    cafeId: MAMMOTH_COFFEE_CAFE.id,
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
  code: string,
): MammothCoffeeCategory => ({
  id: `mammoth-coffee-beverage-${id}`,
  cafeId: MAMMOTH_COFFEE_CAFE.id,
  parentId: "mammoth-coffee-beverage",
  name,
  sortOrder,
  isVisible: true,
  code,
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  code: string,
): MammothCoffeeCategory => ({
  id: `mammoth-coffee-food-${id}`,
  cafeId: MAMMOTH_COFFEE_CAFE.id,
  parentId: "mammoth-coffee-food",
  name,
  sortOrder,
  isVisible: true,
  code,
});

export const MAMMOTH_COFFEE_CATEGORIES: MammothCoffeeCategory[] = [
  beverageCategory("32oz", "32oz", 0, "O"),
  beverageCategory("coffee", "커피", 1, "C"),
  beverageCategory("cold-brew", "콜드브루", 2, "D"),
  beverageCategory("non-coffee", "논커피", 3, "N"),
  beverageCategory("tea-ade", "티·에이드", 4, "T"),
  beverageCategory("frappe", "프라페·블렌디드", 5, "B"),
  beverageCategory("rtd", "RTD", 6, "R"),
  foodCategory("food", "푸드", 0, "F"),
  foodCategory("md", "MD", 1, "M"),
];
