import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type TheVentiCategory = NewCafeCategory & {
  code: string;
};

export const THE_VENTI_CAFE: NewCafe = {
  id: "the-venti",
  name: "더벤티",
  description: "THE VENTI",
  logoUrl: "/logos/the-venti.svg",
  isActive: true,
};

export const THE_VENTI_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "the-venti-beverage",
    cafeId: THE_VENTI_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "the-venti-food",
    cafeId: THE_VENTI_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

export const THE_VENTI_CATEGORIES: TheVentiCategory[] = [
  {
    id: "the-venti-beverage-coffee",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "커피",
    sortOrder: 0,
    isVisible: true,
    code: "2",
  },
  {
    id: "the-venti-beverage-decaf",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "디카페인",
    sortOrder: 1,
    isVisible: true,
    code: "3",
  },
  {
    id: "the-venti-beverage-ice-blended",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "아이스 블렌디드",
    sortOrder: 2,
    isVisible: true,
    code: "4",
  },
  {
    id: "the-venti-beverage-juice-ade",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "주스/에이드",
    sortOrder: 3,
    isVisible: true,
    code: "5",
  },
  {
    id: "the-venti-beverage-bubble-tea-tea",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "버블티/티",
    sortOrder: 4,
    isVisible: true,
    code: "6",
  },
  {
    id: "the-venti-beverage-beverage",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-beverage",
    name: "베버리지",
    sortOrder: 5,
    isVisible: true,
    code: "7",
  },
  {
    id: "the-venti-food-side-rtd",
    cafeId: THE_VENTI_CAFE.id,
    parentId: "the-venti-food",
    name: "사이드메뉴/RTD",
    sortOrder: 0,
    isVisible: true,
    code: "8",
  },
];
