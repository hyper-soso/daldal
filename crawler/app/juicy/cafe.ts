import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type JuicyCategory = NewCafeCategory & {
  /** 메뉴 페이지 경로 (`/products/{path}`) */
  path: string;
};

export const JUICY_CAFE: NewCafe = {
  id: "juicy",
  name: "쥬씨",
  description: "JUICY",
  logoUrl: "/logos/juicy.png",
  isActive: true,
};

export const JUICY_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "juicy-beverage",
    cafeId: JUICY_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "juicy-food",
    cafeId: JUICY_CAFE.id,
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
): JuicyCategory => ({
  id: `juicy-beverage-${id}`,
  cafeId: JUICY_CAFE.id,
  parentId: "juicy-beverage",
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
): JuicyCategory => ({
  id: `juicy-food-${id}`,
  cafeId: JUICY_CAFE.id,
  parentId: "juicy-food",
  name,
  sortOrder,
  isVisible: true,
  path,
});

/**
 * 쥬씨와 쥬씨프레소는 매장 유형이 달라 메뉴판이 따로 있다.
 */
export const JUICY_CATEGORIES: JuicyCategory[] = [
  beverageCategory("fresh-juice", "FRESH JUICE", 0, "fruits"),
  beverageCategory("coffee", "COFFEE", 1, "coffee"),
  beverageCategory("beverage", "BEVERAGE", 2, "beverage"),
  beverageCategory("presso-new", "쥬씨프레소 NEW & SEASON", 3, "pressoNew"),
  beverageCategory("presso-coffee", "쥬씨프레소 COFFEE", 4, "pressoCoffee"),
  beverageCategory("presso-non-coffee", "쥬씨프레소 NON COFFEE", 5, "pressoNon"),
  beverageCategory("presso-juice", "쥬씨프레소 JUICE", 6, "pressoJuice"),
  beverageCategory("presso-tea", "쥬씨프레소 TEA & ADE", 7, "pressoTea"),
  beverageCategory(
    "presso-frappe",
    "쥬씨프레소 FRAPPE & SMOOTHIE",
    8,
    "pressoFrappe",
  ),
  foodCategory("bowl", "BOWL", 0, "bowl"),
  foodCategory("dessert", "DESSERT", 1, "dessert"),
  foodCategory("presso-dessert", "쥬씨프레소 DESSERT", 2, "pressoDessert"),
];
