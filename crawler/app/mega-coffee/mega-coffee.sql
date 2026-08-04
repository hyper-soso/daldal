INSERT INTO cafe (id, name, description, logo_url, is_active)
VALUES ('mega-mgc-coffee', '메가MGC커피', 'MEGA MGC COFFEE', NULL, TRUE);

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
  ('mega-mgc-coffee-beverage', 'mega-mgc-coffee', NULL, '음료', 0, TRUE),
  ('mega-mgc-coffee-food', 'mega-mgc-coffee', NULL, '푸드', 1, TRUE);

-- 하위 카테고리
INSERT INTO cafe_category (
  id,
  cafe_id,
  parent_id,
  name,
  sort_order,
  is_visible
)
VALUES
  (
    'mega-mgc-coffee-beverage-coffee',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '커피',
    0,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-tea',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '티',
    1,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-ade-juice',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '에이드&주스',
    2,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-smoothie-frappe',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '스무디&프라페',
    3,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-decaf',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '디카페인',
    4,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-etc',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '음료',
    5,
    TRUE
  ),
  (
    'mega-mgc-coffee-beverage-new',
    'mega-mgc-coffee',
    'mega-mgc-coffee-beverage',
    '신상품',
    6,
    TRUE
  ),
  (
    'mega-mgc-coffee-food-dessert',
    'mega-mgc-coffee',
    'mega-mgc-coffee-food',
    '디저트',
    0,
    TRUE
  ),
  (
    'mega-mgc-coffee-food-new',
    'mega-mgc-coffee',
    'mega-mgc-coffee-food',
    '신상품',
    1,
    TRUE
  );
