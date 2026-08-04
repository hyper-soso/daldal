INSERT INTO cafe (id, name, description, logo_url, is_active)
VALUES ('pascucci', '파스쿠찌', 'CAFFÈ PASCUCCI', NULL, TRUE);

-- 상위 카테고리
INSERT INTO cafe_category (
  id,
  cafe_id,
  parent_id,
  name,
  sort_order,
  is_visible
)
VALUES
  ('pascucci-beverage', 'pascucci', NULL, '음료', 0, TRUE),
  ('pascucci-food', 'pascucci', NULL, '푸드', 1, TRUE);

-- 음료 하위 카테고리
INSERT INTO cafe_category (
  id,
  cafe_id,
  parent_id,
  name,
  sort_order,
  is_visible
)
VALUES
  ('pascucci-beverage-italian-coffee', 'pascucci', 'pascucci-beverage', '이탈리안커피', 0, TRUE),
  ('pascucci-beverage-coffee', 'pascucci', 'pascucci-beverage', '커피', 1, TRUE),
  ('pascucci-beverage-cold-brew', 'pascucci', 'pascucci-beverage', '콜드브루', 2, TRUE),
  ('pascucci-beverage-season', 'pascucci', 'pascucci-beverage', '시즌음료', 3, TRUE),
  ('pascucci-beverage-granita', 'pascucci', 'pascucci-beverage', '그라니따', 4, TRUE),
  ('pascucci-beverage-tea', 'pascucci', 'pascucci-beverage', '티', 5, TRUE),
  ('pascucci-beverage-etc', 'pascucci', 'pascucci-beverage', '기타음료', 6, TRUE);

-- 푸드 하위 카테고리
INSERT INTO cafe_category (
  id,
  cafe_id,
  parent_id,
  name,
  sort_order,
  is_visible
)
VALUES
  ('pascucci-food-piece-cake', 'pascucci', 'pascucci-food', '조각케이크', 0, TRUE),
  ('pascucci-food-whole-cake', 'pascucci', 'pascucci-food', '홀케이크', 1, TRUE),
  ('pascucci-food-gelato', 'pascucci', 'pascucci-food', '젤라또', 2, TRUE),
  ('pascucci-food-deli', 'pascucci', 'pascucci-food', '델리', 3, TRUE),
  ('pascucci-food-bread', 'pascucci', 'pascucci-food', '브레드', 4, TRUE),
  ('pascucci-food-dessert', 'pascucci', 'pascucci-food', '디저트', 5, TRUE);
