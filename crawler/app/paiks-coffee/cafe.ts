import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type PaiksCoffeeCategory = NewCafeCategory & {
  path: string;
};

export const PAIKS_COFFEE_CAFE: NewCafe = {
  id: "paiks-coffee",
  name: "빽다방",
  description: "PAIK'S COFFEE",
  logoUrl: "/logos/paiks-coffee.svg",
  isActive: true,
};

export const PAIKS_COFFEE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "paiks-coffee-beverage",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "paiks-coffee-food",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

export const PAIKS_COFFEE_CATEGORIES: PaiksCoffeeCategory[] = [
  {
    id: "paiks-coffee-beverage-coffee",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: "paiks-coffee-beverage",
    name: "커피",
    sortOrder: 0,
    isVisible: true,
    path: "menu_coffee",
  },
  {
    id: "paiks-coffee-beverage-drink",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: "paiks-coffee-beverage",
    name: "음료",
    sortOrder: 1,
    isVisible: true,
    path: "menu_drink",
  },
  {
    id: "paiks-coffee-beverage-paiksccino",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: "paiks-coffee-beverage",
    name: "빽스치노",
    sortOrder: 2,
    isVisible: true,
    path: "menu_ccino",
  },
  {
    id: "paiks-coffee-food-dessert",
    cafeId: PAIKS_COFFEE_CAFE.id,
    parentId: "paiks-coffee-food",
    name: "아이스크림/디저트",
    sortOrder: 0,
    isVisible: true,
    path: "menu_dessert",
  },
];
