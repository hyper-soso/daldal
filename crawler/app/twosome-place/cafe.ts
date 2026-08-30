import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type TwosomePlaceCategory = NewCafeCategory & {
  /** 대분류 코드 */
  topCode: string;
  /** 중분류 코드 */
  code: string;
};

export const TWOSOME_PLACE_CAFE: NewCafe = {
  id: "twosome-place",
  name: "투썸플레이스",
  description: "A TWOSOME PLACE",
  logoUrl: "/logos/twosome-place.svg",
  isActive: true,
};

export const TWOSOME_PLACE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "twosome-place-beverage",
    cafeId: TWOSOME_PLACE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "twosome-place-food",
    cafeId: TWOSOME_PLACE_CAFE.id,
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
): TwosomePlaceCategory => ({
  id: `twosome-place-beverage-${id}`,
  cafeId: TWOSOME_PLACE_CAFE.id,
  parentId: "twosome-place-beverage",
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
): TwosomePlaceCategory => ({
  id: `twosome-place-food-${id}`,
  cafeId: TWOSOME_PLACE_CAFE.id,
  parentId: "twosome-place-food",
  name,
  sortOrder,
  isVisible: true,
  topCode,
  code,
});

export const TWOSOME_PLACE_CATEGORIES: TwosomePlaceCategory[] = [
  beverageCategory("coffee", "커피", 0, "1", "01"),
  beverageCategory("beverage", "음료", 1, "1", "02"),
  beverageCategory("tea", "티/티라떼", 2, "1", "03"),
  beverageCategory("ice-cream", "아이스크림/빙수", 3, "1", "04"),
  foodCategory("piece-cake", "피스케이크", 0, "2", "05"),
  foodCategory("macaron", "마카롱", 1, "2", "06"),
  foodCategory("whole-cake", "홀케이크", 2, "4", "07"),
  foodCategory("snack", "스낵", 3, "3", "08"),
  foodCategory("sandwich", "샌드위치", 4, "3", "09"),
  foodCategory("salad", "샐러드/기타", 5, "3", "10"),
  foodCategory("bakery", "베이커리", 6, "3", "12"),
];
