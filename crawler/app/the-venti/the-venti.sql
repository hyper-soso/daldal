INSERT INTO cafe (id, name, description, logo_url, is_active)
VALUES ('the-venti', '더벤티', 'THE VENTI', NULL, TRUE);

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
  ('the-venti-beverage', 'the-venti', NULL, '음료', 0, TRUE),
  ('the-venti-food', 'the-venti', NULL, '푸드', 1, TRUE);

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
    'the-venti-beverage-coffee',
    'the-venti',
    'the-venti-beverage',
    '커피',
    0,
    TRUE
  ),
  (
    'the-venti-beverage-decaf',
    'the-venti',
    'the-venti-beverage',
    '디카페인',
    1,
    TRUE
  ),
  (
    'the-venti-beverage-ice-blended',
    'the-venti',
    'the-venti-beverage',
    '아이스 블렌디드',
    2,
    TRUE
  ),
  (
    'the-venti-beverage-juice-ade',
    'the-venti',
    'the-venti-beverage',
    '주스/에이드',
    3,
    TRUE
  ),
  (
    'the-venti-beverage-bubble-tea-tea',
    'the-venti',
    'the-venti-beverage',
    '버블티/티',
    4,
    TRUE
  ),
  (
    'the-venti-beverage-beverage',
    'the-venti',
    'the-venti-beverage',
    '베버리지',
    5,
    TRUE
  ),
  (
    'the-venti-food-side-rtd',
    'the-venti',
    'the-venti-food',
    '사이드메뉴/RTD',
    0,
    TRUE
  );
