import {
  type AnyPgColumn,
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestampColumns = () => ({
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cafes = pgTable("cafe", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),

  isActive: boolean("is_active").notNull().default(true),

  ...timestampColumns(),
});

export const cafeCategories = pgTable("cafe_category", {
  id: uuid("id").defaultRandom().primaryKey(),

  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id, {
      onDelete: "cascade",
    }),

  parentId: uuid("parent_id").references((): AnyPgColumn => cafeCategories.id, {
    onDelete: "cascade",
  }),

  name: varchar("name", { length: 100 }).notNull(),

  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),

  ...timestampColumns(),
});

export const menus = pgTable("menu", {
  id: uuid("id").defaultRandom().primaryKey(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => cafeCategories.id, {
      onDelete: "cascade",
    }),

  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),

  allergens: text("allergens"),

  isAvailable: boolean("is_available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),

  ...timestampColumns(),
});

/**
 * 메뉴 사이즈별 정보
 *
 * 가격, 용량, 영양성분은 사이즈별로 저장한다.
 */
export const menuVariants = pgTable("menu_variant", {
  id: uuid("id").defaultRandom().primaryKey(),

  menuId: uuid("menu_id")
    .notNull()
    .references(() => menus.id, {
      onDelete: "cascade",
    }),

  /**
   * 예: Regular, Small, Medium, Large
   */
  name: varchar("name", { length: 50 }).notNull(),

  /**
   * 음료가 아니거나 용량 정보가 없으면 null
   */
  size: integer("size"),
  unit: varchar("unit"),

  /**
   * 원 단위 정수
   *
   * 4,500원 → 4500
   */
  price: integer("price").notNull(),

  /**
   * 단위: g
   */
  fat: numeric("fat", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  saturatedFat: numeric("saturated_fat", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  sugars: numeric("sugars", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  protein: numeric("protein", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  carbohydrate: numeric("carbohydrate", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  /**
   * 단위: mg
   */
  sodium: numeric("sodium", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  caffeine: numeric("caffeine", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  /**
   * 단위: kcal
   */
  calories: numeric("calories", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),

  isDefault: boolean("is_default").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),

  sortOrder: integer("sort_order").notNull().default(0),

  ...timestampColumns(),
});

/**
 * 조회 타입
 */
export type Cafe = typeof cafes.$inferSelect;
export type CafeCategory = typeof cafeCategories.$inferSelect;
export type Menu = typeof menus.$inferSelect;
export type MenuVariant = typeof menuVariants.$inferSelect;

/**
 * 생성 타입
 */
export type NewCafe = typeof cafes.$inferInsert;
export type NewCafeCategory = typeof cafeCategories.$inferInsert;
export type NewMenu = typeof menus.$inferInsert;
export type NewMenuVariant = typeof menuVariants.$inferInsert;
