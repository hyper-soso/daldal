CREATE TABLE "cafe_category" (
	"id" varchar PRIMARY KEY NOT NULL,
	"cafe_id" varchar NOT NULL,
	"parent_id" varchar,
	"name" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cafe" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"logo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_variant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"size" integer,
	"unit" varchar,
	"price" integer,
	"fat" numeric(10, 2),
	"saturated_fat" numeric(10, 2),
	"sugars" numeric(10, 2),
	"protein" numeric(10, 2),
	"carbohydrate" numeric(10, 2),
	"sodium" numeric(10, 2),
	"caffeine" numeric(10, 2),
	"calories" numeric(10, 2),
	"is_default" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" varchar NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"image_url" text,
	"allergens" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cafe_category" ADD CONSTRAINT "cafe_category_cafe_id_cafe_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cafe_category" ADD CONSTRAINT "cafe_category_parent_id_cafe_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cafe_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_variant" ADD CONSTRAINT "menu_variant_menu_id_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu" ADD CONSTRAINT "menu_category_id_cafe_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."cafe_category"("id") ON DELETE cascade ON UPDATE no action;