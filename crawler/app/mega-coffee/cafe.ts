import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type MegaCoffeeCategory = NewCafeCategory & {
  topCode: string;
  code: string;
};

export const MEGA_COFFEE_CAFE: NewCafe = {
  id: "mega-mgc-coffee",
  name: "메가MGC커피",
  description: "MEGA MGC COFFEE",
  isActive: true,
};

export const MEGA_COFFEE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "mega-mgc-coffee-beverage",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "mega-mgc-coffee-food",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

export const MEGA_COFFEE_CATEGORIES: MegaCoffeeCategory[] = [
  {
    id: "mega-mgc-coffee-beverage-coffee",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "커피",
    sortOrder: 0,
    isVisible: true,
    topCode: "1",
    code: "1",
  },
  {
    id: "mega-mgc-coffee-beverage-tea",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "티",
    sortOrder: 1,
    isVisible: true,
    topCode: "1",
    code: "2",
  },
  {
    id: "mega-mgc-coffee-beverage-ade-juice",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "에이드&주스",
    sortOrder: 2,
    isVisible: true,
    topCode: "1",
    code: "3",
  },
  {
    id: "mega-mgc-coffee-beverage-smoothie-frappe",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "스무디&프라페",
    sortOrder: 3,
    isVisible: true,
    topCode: "1",
    code: "4",
  },
  {
    id: "mega-mgc-coffee-beverage-decaf",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "디카페인",
    sortOrder: 4,
    isVisible: true,
    topCode: "1",
    code: "5",
  },
  {
    id: "mega-mgc-coffee-beverage-etc",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "음료",
    sortOrder: 5,
    isVisible: true,
    topCode: "1",
    code: "6",
  },
  {
    id: "mega-mgc-coffee-beverage-new",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-beverage",
    name: "신상품",
    sortOrder: 6,
    isVisible: true,
    topCode: "1",
    code: "9",
  },
  {
    id: "mega-mgc-coffee-food-dessert",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-food",
    name: "디저트",
    sortOrder: 0,
    isVisible: true,
    topCode: "2",
    code: "7",
  },
  {
    id: "mega-mgc-coffee-food-new",
    cafeId: MEGA_COFFEE_CAFE.id,
    parentId: "mega-mgc-coffee-food",
    name: "신상품",
    sortOrder: 1,
    isVisible: true,
    topCode: "2",
    code: "10",
  },
];
