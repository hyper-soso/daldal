import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type PaulBassettCategory = NewCafeCategory & {
  topCode: string;
  code: string;
};

export const PAUL_BASSETT_CAFE: NewCafe = {
  id: "paul-bassett",
  name: "폴바셋",
  description: "PAUL BASSETT",
  logoUrl: "/logos/paul-bassett.svg",
  isActive: true,
};

export const PAUL_BASSETT_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "paul-bassett-beverage",
    cafeId: PAUL_BASSETT_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "paul-bassett-food",
    cafeId: PAUL_BASSETT_CAFE.id,
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
  topCode: string,
  code: string,
): PaulBassettCategory => ({
  id: `paul-bassett-beverage-${id}`,
  cafeId: PAUL_BASSETT_CAFE.id,
  parentId: "paul-bassett-beverage",
  name,
  sortOrder,
  isVisible: true,
  topCode,
  code,
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  topCode: string,
  code: string,
): PaulBassettCategory => ({
  id: `paul-bassett-food-${id}`,
  cafeId: PAUL_BASSETT_CAFE.id,
  parentId: "paul-bassett-food",
  name,
  sortOrder,
  isVisible: true,
  topCode,
  code,
});

/**
 * 같은 메뉴가 여러 하위 탭에 노출되므로 먼저 등장한 카테고리에 담는다.
 */
export const PAUL_BASSETT_CATEGORIES: PaulBassettCategory[] = [
  beverageCategory("espresso", "Espresso", 0, "A", "A"),
  beverageCategory("coffee", "Coffee", 1, "A", "B"),
  beverageCategory("latte", "Latte", 2, "A", "C"),
  beverageCategory("cold-brew", "Cold Brew", 3, "A", "D"),
  beverageCategory("single-origin", "Single Origin", 4, "A", "E"),
  beverageCategory("decaf", "Decaf", 5, "A", "F"),
  beverageCategory("frappe", "Frappe", 6, "B", "B"),
  beverageCategory("ade-juice", "Ade · Juice", 7, "B", "D"),
  beverageCategory("tea", "Tea", 8, "B", "E"),
  beverageCategory("tea-latte", "Tea Latte", 9, "B", "F"),
  beverageCategory("chocolate", "Chocolate", 10, "B", "G"),
  beverageCategory("yogurt", "Yogurt", 11, "B", "H"),
  beverageCategory("ice-cream-latte", "아이스크림 라떼", 12, "C", "B"),
  foodCategory("ice-cream-topping", "토핑 아이스크림", 0, "C", "A"),
  foodCategory("ice-cream-cone", "아이스크림 콘", 1, "C", "C"),
  foodCategory("ice-cream-cup", "아이스크림 컵", 2, "C", "D"),
  foodCategory("snack", "스낵", 3, "D", "A"),
  foodCategory("cake", "케이크", 4, "D", "B"),
  foodCategory("meal", "식사대용식", 5, "D", "C"),
  foodCategory("bakery", "베이커리", 6, "D", "D"),
  foodCategory("pizza-pasta", "피자 · 파스타", 7, "D", "E"),
];
