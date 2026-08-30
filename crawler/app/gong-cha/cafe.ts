import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type GongChaCategory = NewCafeCategory & {
  code: string;
};

export const GONG_CHA_CAFE: NewCafe = {
  id: "gong-cha",
  name: "공차",
  description: "GONG CHA",
  logoUrl: "/logos/gong-cha.svg",
  isActive: true,
};

export const GONG_CHA_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "gong-cha-beverage",
    cafeId: GONG_CHA_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "gong-cha-food",
    cafeId: GONG_CHA_CAFE.id,
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
): GongChaCategory => ({
  id: `gong-cha-beverage-${id}`,
  cafeId: GONG_CHA_CAFE.id,
  parentId: "gong-cha-beverage",
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
): GongChaCategory => ({
  id: `gong-cha-food-${id}`,
  cafeId: GONG_CHA_CAFE.id,
  parentId: "gong-cha-food",
  name,
  sortOrder,
  isVisible: true,
  code,
});

export const GONG_CHA_CATEGORIES: GongChaCategory[] = [
  beverageCategory("new", "New 시즌 메뉴", 0, "001001"),
  beverageCategory("best", "베스트셀러", 1, "001002"),
  beverageCategory("milk-tea", "밀크티", 2, "001006"),
  beverageCategory("smoothie", "스무디", 3, "001010"),
  beverageCategory("original-tea", "오리지널 티", 4, "001003"),
  beverageCategory("fruity", "프룻티&모어", 5, "001015"),
  beverageCategory("coffee", "커피", 6, "001011"),
  beverageCategory("yogurty", "요거티", 7, "001017"),
  beverageCategory("one-liter", "1리터 배달 메뉴", 8, "001018"),
  foodCategory("bakery", "베이커리", 0, "002001"),
  foodCategory("snack", "스낵", 1, "002004"),
  foodCategory("ice-cream", "아이스크림", 2, "002006"),
  foodCategory("md", "MD식품", 3, "003002"),
];
