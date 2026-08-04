INSERT INTO cafe (id, name, description, logo_url, is_active)
VALUES ('starbucks', '스타벅스', 'STARBUCKS', NULL, TRUE);

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
  ('starbucks-beverage', 'starbucks', NULL, '음료', 0, TRUE),
  ('starbucks-food', 'starbucks', NULL, '푸드', 1, TRUE);

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
  ('starbucks-beverage-cold-brew', 'starbucks', 'starbucks-beverage', '콜드 브루 커피', 0, TRUE),
  ('starbucks-beverage-brewed', 'starbucks', 'starbucks-beverage', '브루드 커피', 1, TRUE),
  ('starbucks-beverage-espresso', 'starbucks', 'starbucks-beverage', '에스프레소', 2, TRUE),
  ('starbucks-beverage-frappuccino', 'starbucks', 'starbucks-beverage', '프라푸치노', 3, TRUE),
  ('starbucks-beverage-blended', 'starbucks', 'starbucks-beverage', '블렌디드', 4, TRUE),
  ('starbucks-beverage-refresher', 'starbucks', 'starbucks-beverage', '스타벅스 리프레셔', 5, TRUE),
  ('starbucks-beverage-fizzio', 'starbucks', 'starbucks-beverage', '스타벅스 피지오', 6, TRUE),
  ('starbucks-beverage-tea', 'starbucks', 'starbucks-beverage', '티(티바나)', 7, TRUE),
  ('starbucks-beverage-etc', 'starbucks', 'starbucks-beverage', '기타 제조 음료', 8, TRUE),
  ('starbucks-beverage-rtd', 'starbucks', 'starbucks-beverage', '스타벅스 주스(병음료)', 9, TRUE);

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
  ('starbucks-food-bread', 'starbucks', 'starbucks-food', '브레드', 0, TRUE),
  ('starbucks-food-cake', 'starbucks', 'starbucks-food', '케이크', 1, TRUE),
  ('starbucks-food-sandwich-salad', 'starbucks', 'starbucks-food', '샌드위치 & 샐러드', 2, TRUE),
  ('starbucks-food-warm', 'starbucks', 'starbucks-food', '따뜻한 푸드', 3, TRUE),
  ('starbucks-food-fruit-yogurt', 'starbucks', 'starbucks-food', '과일 & 요거트', 4, TRUE),
  ('starbucks-food-snack-mini-dessert', 'starbucks', 'starbucks-food', '스낵 & 미니 디저트', 5, TRUE),
  ('starbucks-food-ice-cream', 'starbucks', 'starbucks-food', '아이스크림', 6, TRUE);
