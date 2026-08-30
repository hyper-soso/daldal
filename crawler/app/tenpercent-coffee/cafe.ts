import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type TenpercentCoffeeCategory = NewCafeCategory & {
  /** 그누보드 게시판 코드 */
  boardTable: string;
};

export const TENPERCENT_COFFEE_CAFE: NewCafe = {
  id: "tenpercent-coffee",
  name: "텐퍼센트커피",
  description: "TENPERCENT COFFEE",
  logoUrl: "/logos/tenpercent-coffee.svg",
  isActive: true,
};

export const TENPERCENT_COFFEE_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "tenpercent-coffee-beverage",
    cafeId: TENPERCENT_COFFEE_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "tenpercent-coffee-food",
    cafeId: TENPERCENT_COFFEE_CAFE.id,
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
  boardTable: string,
): TenpercentCoffeeCategory => ({
  id: `tenpercent-coffee-beverage-${id}`,
  cafeId: TENPERCENT_COFFEE_CAFE.id,
  parentId: "tenpercent-coffee-beverage",
  name,
  sortOrder,
  isVisible: true,
  boardTable,
});

export const TENPERCENT_COFFEE_CATEGORIES: TenpercentCoffeeCategory[] = [
  beverageCategory("signature", "시그니처", 0, "sub22"),
  beverageCategory("coffee", "커피", 1, "sub23"),
  beverageCategory("matcha", "말차", 2, "sub26"),
  beverageCategory("tenup", "텐업", 3, "sub24"),
  {
    id: "tenpercent-coffee-food-dessert",
    cafeId: TENPERCENT_COFFEE_CAFE.id,
    parentId: "tenpercent-coffee-food",
    name: "디저트/MD",
    sortOrder: 0,
    isVisible: true,
    boardTable: "sub25",
  },
];
