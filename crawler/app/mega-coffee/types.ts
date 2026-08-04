import { type NewMenu, type NewMenuVariant } from "@/drizzle/schema";

export type CrawledMenu = NewMenu & { id: string };

export type MegaCoffeeCrawlResult = {
  menus: CrawledMenu[];
  variants: NewMenuVariant[];
};
