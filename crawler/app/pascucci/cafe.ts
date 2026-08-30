import { type NewCafe, type NewCafeCategory } from "@/drizzle/schema";

export type PascucciSource = {
  code: string;
  temperature: "HOT" | "ICED" | null;
};

export type PascucciCategory = NewCafeCategory & {
  sources: PascucciSource[];
};

export const PASCUCCI_CAFE: NewCafe = {
  id: "pascucci",
  name: "파스쿠찌",
  description: "CAFFÈ PASCUCCI",
  logoUrl: "/logos/pascucci.svg",
  isActive: true,
};

export const PASCUCCI_ROOT_CATEGORIES: NewCafeCategory[] = [
  {
    id: "pascucci-beverage",
    cafeId: PASCUCCI_CAFE.id,
    parentId: null,
    name: "음료",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "pascucci-food",
    cafeId: PASCUCCI_CAFE.id,
    parentId: null,
    name: "푸드",
    sortOrder: 1,
    isVisible: true,
  },
];

const category = (
  id: string,
  parentId: "pascucci-beverage" | "pascucci-food",
  name: string,
  sortOrder: number,
  sources: PascucciSource[],
): PascucciCategory => ({
  id: `pascucci-${parentId === "pascucci-beverage" ? "beverage" : "food"}-${id}`,
  cafeId: PASCUCCI_CAFE.id,
  parentId,
  name,
  sortOrder,
  isVisible: true,
  sources,
});

export const PASCUCCI_CATEGORIES: PascucciCategory[] = [
  category("italian-coffee", "pascucci-beverage", "이탈리안커피", 0, [
    { code: "00100010", temperature: null },
  ]),
  category("coffee", "pascucci-beverage", "커피", 1, [
    { code: "00100020", temperature: "HOT" },
    { code: "00100030", temperature: "ICED" },
  ]),
  category("cold-brew", "pascucci-beverage", "콜드브루", 2, [
    { code: "00100040", temperature: null },
  ]),
  category("season", "pascucci-beverage", "시즌음료", 3, [
    { code: "00200010", temperature: null },
  ]),
  category("granita", "pascucci-beverage", "그라니따", 4, [
    { code: "00200020", temperature: null },
  ]),
  category("tea", "pascucci-beverage", "티", 5, [
    { code: "00200030", temperature: null },
  ]),
  category("etc", "pascucci-beverage", "기타음료", 6, [
    { code: "00200050", temperature: null },
  ]),
  category("piece-cake", "pascucci-food", "조각케이크", 0, [
    { code: "00210010", temperature: null },
  ]),
  category("whole-cake", "pascucci-food", "홀케이크", 1, [
    { code: "00210020", temperature: null },
  ]),
  category("gelato", "pascucci-food", "젤라또", 2, [
    { code: "00300010", temperature: null },
  ]),
  category("deli", "pascucci-food", "델리", 3, [
    { code: "00300020", temperature: null },
  ]),
  category("bread", "pascucci-food", "브레드", 4, [
    { code: "00300030", temperature: null },
  ]),
  category("dessert", "pascucci-food", "디저트", 5, [
    { code: "00300040", temperature: null },
  ]),
];
