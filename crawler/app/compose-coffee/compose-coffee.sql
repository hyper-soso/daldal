INSERT INTO cafe (id, name, description, logo_url, is_active)
VALUES ('compose-coffee', '컴포즈커피', 'COMPOSE COFFEE', NULL, TRUE);

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
  ('compose-coffee-beverage', 'compose-coffee', NULL, '음료', 0, TRUE),
  ('compose-coffee-food', 'compose-coffee', NULL, '푸드', 1, TRUE);

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
    'compose-coffee-beverage-coffee-cold-brew',
    'compose-coffee',
    'compose-coffee-beverage',
    '커피ㆍ콜드브루',
    0,
    TRUE
  ),
  (
    'compose-coffee-beverage-beverage',
    'compose-coffee',
    'compose-coffee-beverage',
    '베버리지',
    1,
    TRUE
  ),
  (
    'compose-coffee-beverage-frappe-smoothie',
    'compose-coffee',
    'compose-coffee-beverage',
    '프라페ㆍ스무디',
    2,
    TRUE
  ),
  (
    'compose-coffee-beverage-milkshake',
    'compose-coffee',
    'compose-coffee-beverage',
    '밀크쉐이크',
    3,
    TRUE
  ),
  (
    'compose-coffee-beverage-ade-juice',
    'compose-coffee',
    'compose-coffee-beverage',
    '에이드ㆍ주스',
    4,
    TRUE
  ),
  (
    'compose-coffee-beverage-tea',
    'compose-coffee',
    'compose-coffee-beverage',
    '티',
    5,
    TRUE
  ),
  (
    'compose-coffee-food-dessert',
    'compose-coffee',
    'compose-coffee-food',
    '푸드ㆍ디저트',
    0,
    TRUE
  ),
  (
    'compose-coffee-food-ice-cream',
    'compose-coffee',
    'compose-coffee-food',
    '아이스크림',
    1,
    TRUE
  );
