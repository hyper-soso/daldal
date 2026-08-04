import { type NewMenu, type NewMenuVariant } from "@/drizzle/schema";

export type CrawledMenu = NewMenu & { id: string };

export type PascucciCrawlResult = {
  menus: CrawledMenu[];
  variants: NewMenuVariant[];
};
