import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type StarbucksCategory = NewCafeCategory & {
  code: string;
  type: "drink" | "food";
};

export const STARBUCKS_CAFE: NewCafe = {
  id: "starbucks",
  name: "스타벅스",
  description: "STARBUCKS",
  isActive: true,
};

export const STARBUCKS_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "starbucks-beverage",
    cafeId: STARBUCKS_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "starbucks-food",
    cafeId: STARBUCKS_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

const drinkCategory = (
  id: string,
  name: string,
  sortOrder: number,
  code: string,
): StarbucksCategory => ({
  id: `starbucks-beverage-${id}`,
  cafeId: STARBUCKS_CAFE.id,
  parentId: "starbucks-beverage",
  name,
  sortOrder,
  isVisible: true,
  code,
  type: "drink",
});

const foodCategory = (
  id: string,
  name: string,
  sortOrder: number,
  code: string,
): StarbucksCategory => ({
  id: `starbucks-food-${id}`,
  cafeId: STARBUCKS_CAFE.id,
  parentId: "starbucks-food",
  name,
  sortOrder,
  isVisible: true,
  code,
  type: "food",
});

export const STARBUCKS_CATEGORIES: StarbucksCategory[] = [
  drinkCategory("cold-brew", "콜드 브루 커피", 0, "W0000171.js"),
  drinkCategory("brewed", "브루드 커피", 1, "W0000060.js"),
  drinkCategory("espresso", "에스프레소", 2, "W0000003.js"),
  drinkCategory("frappuccino", "프라푸치노", 3, "W0000004.js"),
  drinkCategory("blended", "블렌디드", 4, "W0000005.js"),
  drinkCategory("refresher", "스타벅스 리프레셔", 5, "W0000422.js"),
  drinkCategory("fizzio", "스타벅스 피지오", 6, "W0000061.js"),
  drinkCategory("tea", "티(티바나)", 7, "W0000075.js"),
  drinkCategory("etc", "기타 제조 음료", 8, "W0000053.js"),
  drinkCategory("rtd", "스타벅스 주스(병음료)", 9, "W0000062.js"),
  foodCategory("bread", "브레드", 0, "W0000013.js"),
  foodCategory("cake", "케이크", 1, "W0000032.js"),
  foodCategory("sandwich-salad", "샌드위치 & 샐러드", 2, "W0000033.js"),
  foodCategory("warm", "따뜻한 푸드", 3, "W0000054.js"),
  foodCategory("fruit-yogurt", "과일 & 요거트", 4, "W0000055.js"),
  foodCategory("snack-mini-dessert", "스낵 & 미니 디저트", 5, "W0000056.js"),
  foodCategory("ice-cream", "아이스크림", 6, "W0000064.js"),
];
