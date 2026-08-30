-- 공개 클라이언트(anon / authenticated)를 읽기 전용으로 고정한다.
-- Supabase 기본 설정은 public 스키마의 모든 테이블에 INSERT/UPDATE/DELETE/TRUNCATE 까지
-- 부여하므로, anon key 만으로 데이터를 지울 수 있다. 아래에서 SELECT 만 남기고 회수한다.
--
-- 크롤러는 postgres 롤(BYPASSRLS)로 접속하므로 RLS 를 켜도 기존 적재 로직은 영향받지 않는다.

REVOKE ALL ON TABLE "cafe" FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE "cafe_category" FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE "menu" FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE "menu_variant" FROM anon, authenticated;--> statement-breakpoint

GRANT SELECT ON TABLE "cafe" TO anon, authenticated;--> statement-breakpoint
GRANT SELECT ON TABLE "cafe_category" TO anon, authenticated;--> statement-breakpoint
GRANT SELECT ON TABLE "menu" TO anon, authenticated;--> statement-breakpoint
GRANT SELECT ON TABLE "menu_variant" TO anon, authenticated;--> statement-breakpoint

ALTER TABLE "cafe" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cafe_category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "menu" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "menu_variant" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- 조회는 전면 허용. 쓰기 정책은 만들지 않으므로 INSERT/UPDATE/DELETE 는 RLS 단계에서도 막힌다.
CREATE POLICY "cafe_public_select" ON "cafe" FOR SELECT TO anon, authenticated USING (true);--> statement-breakpoint
CREATE POLICY "cafe_category_public_select" ON "cafe_category" FOR SELECT TO anon, authenticated USING (true);--> statement-breakpoint
CREATE POLICY "menu_public_select" ON "menu" FOR SELECT TO anon, authenticated USING (true);--> statement-breakpoint
CREATE POLICY "menu_variant_public_select" ON "menu_variant" FOR SELECT TO anon, authenticated USING (true);--> statement-breakpoint

-- 앞으로 drizzle 이 만드는 테이블도 기본적으로 쓰기 권한이 붙지 않도록 한다.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;
