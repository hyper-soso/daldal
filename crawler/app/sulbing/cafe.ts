import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type SulbingCategory = NewCafeCategory & {
  /** 메뉴 목록 페이지의 `type` 파라미터 */
  type: string;
  /** 목록 페이지에서 카테고리를 구분하는 소제목 */
  title: string;
};

export const SULBING_CAFE: NewCafe = {
  id: "sulbing",
  name: "설빙",
  description: "SULBING",
  logoUrl: "/logos/sulbing.svg",
  isActive: true,
};

export const SULBING_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "sulbing-beverage",
    cafeId: SULBING_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "sulbing-food",
    cafeId: SULBING_CAFE.id,
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
  title: string,
): SulbingCategory => ({
  id: `sulbing-beverage-${id}`,
  cafeId: SULBING_CAFE.id,
  parentId: "sulbing-beverage",
  name,
  sortOrder,
  isVisible: true,
  type: "음료",
  title,
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  type: string,
  title: string,
): SulbingCategory => ({
  id: `sulbing-food-${id}`,
  cafeId: SULBING_CAFE.id,
  parentId: "sulbing-food",
  name,
  sortOrder,
  isVisible: true,
  type,
  title,
});

export const SULBING_CATEGORIES: SulbingCategory[] = [
  beverageCategory("coffee", "COFFEE", 0, "COFFEE"),
  beverageCategory("beverage", "BEVERAGE", 1, "BEVERAGE"),
  beverageCategory("tea", "TEA", 2, "TEA"),
  foodCategory("special", "설빙 SPECIAL", 0, "설빙", "SPECIAL"),
  foodCategory("regular", "설빙 REGULAR", 1, "설빙", "REGULAR"),
  foodCategory("side", "사이드", 2, "사이드", "SIDE"),
];
