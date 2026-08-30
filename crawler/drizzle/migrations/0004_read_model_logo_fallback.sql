-- 로고 폴백을 실제 존재하는 파일로 교체한다.
-- 브랜드마다 확장자가 달라(.svg/.png/.webp) id 기반으로 경로를 조립하면
-- 로고가 없는 브랜드에서 깨진 경로가 나가고 next/image 가 실패한다.

CREATE OR REPLACE FUNCTION refresh_web_read_model() RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
	-- 1) cafes
	INSERT INTO cafes (id, name_kor, name_eng, logo_url)
	SELECT
		c.id,
		c.name,
		coalesce(c.description, ''),
		coalesce(c.logo_url, '/logos/_placeholder.svg')
	FROM cafe c
	WHERE c.is_active
	ON CONFLICT (id) DO UPDATE SET
		name_kor = EXCLUDED.name_kor,
		name_eng = EXCLUDED.name_eng,
		logo_url = EXCLUDED.logo_url;

	DELETE FROM cafes
	WHERE id NOT IN (SELECT c.id FROM cafe c WHERE c.is_active);

	-- 2) categories — 메뉴가 실제로 달린 카테고리만. (음료/푸드 같은 루트는 칩으로 띄워도 빈 목록이 된다)
	INSERT INTO categories (source_id, name, type, cafe_id, sort_order)
	SELECT
		cc.id,
		cc.name,
		coalesce(parent.name, ''),
		cc.cafe_id,
		cc.sort_order
	FROM cafe_category cc
	LEFT JOIN cafe_category parent ON parent.id = cc.parent_id
	WHERE cc.is_visible
		AND EXISTS (SELECT 1 FROM menu m WHERE m.category_id = cc.id)
	ON CONFLICT (source_id) DO UPDATE SET
		name = EXCLUDED.name,
		type = EXCLUDED.type,
		cafe_id = EXCLUDED.cafe_id,
		sort_order = EXCLUDED.sort_order;

	DELETE FROM categories
	WHERE source_id NOT IN (
		SELECT cc.id FROM cafe_category cc
		WHERE cc.is_visible AND EXISTS (SELECT 1 FROM menu m WHERE m.category_id = cc.id)
	);

	-- 3) menus — 사이즈(menu_variant)별 1행
	CREATE TEMP TABLE _menu_src ON COMMIT DROP AS
	SELECT
		cc.id
			|| '|' || m.name
			|| '|' || mv.name
			|| CASE
				WHEN row_number() OVER (
					PARTITION BY cc.id, m.name, mv.name ORDER BY m.sort_order, mv.sort_order, m.id, mv.id
				) > 1
				THEN '#' || row_number() OVER (
					PARTITION BY cc.id, m.name, mv.name ORDER BY m.sort_order, mv.sort_order, m.id, mv.id
				)::text
				ELSE ''
			END AS source_key,
		cc.cafe_id,
		cat.id AS category_id,
		-- 사이즈가 여러 개인 메뉴만 이름 뒤에 사이즈를 붙여 목록에서 구분한다
		CASE WHEN vc.cnt > 1 THEN m.name || ' (' || mv.name || ')' ELSE m.name END AS name_kor,
		coalesce(m.description, '') AS description,
		m.image_url,
		mv.name AS size_name,
		mv.size AS serving_size,
		mv.unit AS serving_unit,
		mv.calories, mv.carbohydrate, mv.sugars, mv.protein, mv.fat,
		mv.saturated_fat, mv.sodium, mv.caffeine,
		coalesce(
			(
				SELECT array_agg(btrim(t) ORDER BY ord)
				FROM unnest(string_to_array(m.allergens, ',')) WITH ORDINALITY AS u(t, ord)
				WHERE btrim(t) <> '' AND btrim(t) <> '-'
			),
			'{}'::text[]
		) AS allergens,
		m.sort_order * 1000 + mv.sort_order AS sort_order
	FROM menu m
	JOIN cafe_category cc ON cc.id = m.category_id
	JOIN categories cat ON cat.source_id = cc.id
	JOIN menu_variant mv ON mv.menu_id = m.id
	JOIN (SELECT menu_id, count(*) AS cnt FROM menu_variant GROUP BY menu_id) vc ON vc.menu_id = m.id;

	INSERT INTO menus (
		source_key, cafe_id, category_id, name_kor, description, image_url,
		size_name, serving_size, serving_unit,
		calories, carbohydrate, sugars, protein, fat, saturated_fat, sodium, caffeine,
		allergens, sort_order
	)
	SELECT
		source_key, cafe_id, category_id, name_kor, description, image_url,
		size_name, serving_size, serving_unit,
		calories, carbohydrate, sugars, protein, fat, saturated_fat, sodium, caffeine,
		allergens, sort_order
	FROM _menu_src
	ON CONFLICT (source_key) DO UPDATE SET
		cafe_id = EXCLUDED.cafe_id,
		category_id = EXCLUDED.category_id,
		name_kor = EXCLUDED.name_kor,
		description = EXCLUDED.description,
		image_url = EXCLUDED.image_url,
		size_name = EXCLUDED.size_name,
		serving_size = EXCLUDED.serving_size,
		serving_unit = EXCLUDED.serving_unit,
		calories = EXCLUDED.calories,
		carbohydrate = EXCLUDED.carbohydrate,
		sugars = EXCLUDED.sugars,
		protein = EXCLUDED.protein,
		fat = EXCLUDED.fat,
		saturated_fat = EXCLUDED.saturated_fat,
		sodium = EXCLUDED.sodium,
		caffeine = EXCLUDED.caffeine,
		allergens = EXCLUDED.allergens,
		sort_order = EXCLUDED.sort_order;

	DELETE FROM menus WHERE source_key NOT IN (SELECT source_key FROM _menu_src);

	DROP TABLE _menu_src;
END;
$$;

SELECT refresh_web_read_model();
