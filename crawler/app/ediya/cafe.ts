import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type EdiyaCategory = NewCafeCategory & {
  code: string;
  subCode: string;
};

export const EDIYA_CAFE: NewCafe = {
  id: "ediya",
  name: "이디야커피",
  description: "EDIYA COFFEE",
  logoUrl: "/logos/ediya.svg",
  isActive: true,
};

export const EDIYA_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "ediya-beverage",
    cafeId: "ediya",
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "ediya-food",
    cafeId: "ediya",
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

export const EDIYA_BEVERAGE: EdiyaCategory[] = [
  {
    id: "ediya-beverage-coffee",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "COFFEE",
    sortOrder: 0,
    isVisible: true,
    code: "7",
    subCode: "12",
  },
  {
    id: "ediya-beverage-beverage",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "BEVERAGE",
    sortOrder: 1,
    isVisible: true,
    code: "7",
    subCode: "13",
  },
  {
    id: "ediya-beverage-tea",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "BLENDING TEA",
    sortOrder: 2,
    isVisible: true,
    code: "7",
    subCode: "14",
  },
  {
    id: "ediya-beverage-flatccino",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "FLATCCINO",
    sortOrder: 3,
    isVisible: true,
    code: "7",
    subCode: "15",
  },
  {
    id: "ediya-beverage-shake",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "SHAKE & ADE",
    sortOrder: 4,
    isVisible: true,
    code: "7",
    subCode: "16",
  },
  {
    id: "ediya-beverage-bingsu",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "ICE FLAKES",
    sortOrder: 5,
    isVisible: true,
    code: "7",
    subCode: "71",
  },
  {
    id: "ediya-beverage-rtd",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "RTD",
    sortOrder: 6,
    isVisible: true,
    code: "7",
    subCode: "83",
  },
  {
    id: "ediya-beverage-ice-cream",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "ICE CREAM",
    sortOrder: 7,
    isVisible: true,
    code: "7",
    subCode: "154",
  },
  {
    id: "ediya-beverage-decaf",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "DECAF",
    sortOrder: 8,
    isVisible: true,
    code: "7",
    subCode: "155",
  },
  {
    id: "ediya-beverage-topping",
    cafeId: "ediya",
    parentId: "ediya-beverage",
    name: "TOPPING",
    sortOrder: 9,
    isVisible: true,
    code: "7",
    subCode: "159",
  },
];

export const EDIYA_FOOD: EdiyaCategory[] = [
  {
    id: "ediya-food-bread",
    cafeId: "ediya",
    parentId: "ediya-food",
    name: "BREAD",
    sortOrder: 0,
    isVisible: true,
    code: "8",
    subCode: "17",
  },
  {
    id: "ediya-food-dessert",
    cafeId: "ediya",
    parentId: "ediya-food",
    name: "DESSERT",
    sortOrder: 1,
    isVisible: true,
    code: "8",
    subCode: "18",
  },
  {
    id: "ediya-food-deli",
    cafeId: "ediya",
    parentId: "ediya-food",
    name: "DELI",
    sortOrder: 2,
    isVisible: true,
    code: "8",
    subCode: "19",
  },
  {
    id: "ediya-food-rte",
    cafeId: "ediya",
    parentId: "ediya-food",
    name: "RTE",
    sortOrder: 3,
    isVisible: true,
    code: "8",
    subCode: "128",
  },
];

export const EDIYA_CATEGORIES: EdiyaCategory[] = [
  ...EDIYA_BEVERAGE,
  ...EDIYA_FOOD,
];
