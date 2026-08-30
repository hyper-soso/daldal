import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type ComposeCoffeeCategory = NewCafeCategory & {
  code: string;
};

export const COMPOSE_COFFEE_CAFE: NewCafe = {
  id: "compose-coffee",
  name: "컴포즈커피",
  description: "COMPOSE COFFEE",
  logoUrl: "/logos/compose-coffee.svg",
  isActive: true,
};

export const COMPOSE_COFFEE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "compose-coffee-beverage",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "compose-coffee-food",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

export const COMPOSE_COFFEE_CATEGORIES: ComposeCoffeeCategory[] = [
  {
    id: "compose-coffee-beverage-coffee-cold-brew",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "커피ㆍ콜드브루",
    sortOrder: 0,
    isVisible: true,
    code: "303364",
  },
  {
    id: "compose-coffee-beverage-beverage",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "베버리지",
    sortOrder: 1,
    isVisible: true,
    code: "303365",
  },
  {
    id: "compose-coffee-beverage-frappe-smoothie",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "프라페ㆍ스무디",
    sortOrder: 2,
    isVisible: true,
    code: "303366",
  },
  {
    id: "compose-coffee-beverage-milkshake",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "밀크쉐이크",
    sortOrder: 3,
    isVisible: true,
    code: "303367",
  },
  {
    id: "compose-coffee-beverage-ade-juice",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "에이드ㆍ주스",
    sortOrder: 4,
    isVisible: true,
    code: "303368",
  },
  {
    id: "compose-coffee-beverage-tea",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-beverage",
    name: "티",
    sortOrder: 5,
    isVisible: true,
    code: "303369",
  },
  {
    id: "compose-coffee-food-dessert",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-food",
    name: "푸드ㆍ디저트",
    sortOrder: 0,
    isVisible: true,
    code: "308857",
  },
  {
    id: "compose-coffee-food-ice-cream",
    cafeId: COMPOSE_COFFEE_CAFE.id,
    parentId: "compose-coffee-food",
    name: "아이스크림",
    sortOrder: 1,
    isVisible: true,
    code: "303371",
  },
];
