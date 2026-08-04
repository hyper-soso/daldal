INSERT INTO
  cafe (id, name, description, logo_url, is_active)
VALUES
  (
    'paiks-coffee',
    '빽다방',
    'PAIK''S COFFEE',
    NULL,
    TRUE
  );

-- 상위 카테고리
INSERT INTO
  cafe_category (
    id,
    cafe_id,
    parent_id,
    name,
    sort_order,
    is_visible
  )
VALUES
  (
    'paiks-coffee-beverage',
    'paiks-coffee',
    NULL,
    '음료',
    0,
    TRUE
  ),
  (
    'paiks-coffee-food',
    'paiks-coffee',
    NULL,
    '푸드',
    1,
    TRUE
  );

-- 하위 카테고리
INSERT INTO
  cafe_category (
    id,
    cafe_id,
    parent_id,
    name,
    sort_order,
    is_visible
  )
VALUES
  (
    'paiks-coffee-beverage-coffee',
    'paiks-coffee',
    'paiks-coffee-beverage',
    '커피',
    0,
    TRUE
  ),
  (
    'paiks-coffee-beverage-drink',
    'paiks-coffee',
    'paiks-coffee-beverage',
    '음료',
    1,
    TRUE
  ),
  (
    'paiks-coffee-beverage-paiksccino',
    'paiks-coffee',
    'paiks-coffee-beverage',
    '빽스치노',
    2,
    TRUE
  ),
  (
    'paiks-coffee-food-dessert',
    'paiks-coffee',
    'paiks-coffee-food',
    '아이스크림/디저트',
    0,
    TRUE
  );