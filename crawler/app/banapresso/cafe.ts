import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type BanapressoCategory = NewCafeCategory & {
  /** 주문 API가 내려주는 `sItemDivision` 값 */
  division: string;
};

export const BANAPRESSO_CAFE: NewCafe = {
  id: "banapresso",
  name: "바나프레소",
  description: "BANAPRESSO",
  logoUrl: "/logos/banapresso.svg",
  isActive: true,
};

export const BANAPRESSO_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "banapresso-beverage",
    cafeId: BANAPRESSO_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "banapresso-food",
    cafeId: BANAPRESSO_CAFE.id,
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
  division: string,
): BanapressoCategory => ({
  id: `banapresso-beverage-${id}`,
  cafeId: BANAPRESSO_CAFE.id,
  parentId: "banapresso-beverage",
  name,
  sortOrder,
  isVisible: true,
  division,
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  division: string,
): BanapressoCategory => ({
  id: `banapresso-food-${id}`,
  cafeId: BANAPRESSO_CAFE.id,
  parentId: "banapresso-food",
  name,
  sortOrder,
  isVisible: true,
  division,
});

export const BANAPRESSO_CATEGORIES: BanapressoCategory[] = [
  beverageCategory("coffee", "커피", 0, "커피"),
  beverageCategory("decaf", "디카페인 커피", 1, "디카페인 커피"),
  beverageCategory("latte", "라떼", 2, "라떼"),
  beverageCategory("low-sugar", "저당&제로슈가", 3, "저당&제로슈가"),
  beverageCategory("juice-drink", "주스 & 드링크", 4, "주스 & 드링크"),
  beverageCategory("banaccino", "바나치노 & 스무디", 5, "바나치노 & 스무디"),
  beverageCategory("tea-ade", "티 & 에이드", 6, "티 & 에이드"),
  foodCategory("ice-cream", "ICE CREAM", 0, "ICE CREAM"),
  foodCategory("dessert", "디저트", 1, "디저트"),
];
