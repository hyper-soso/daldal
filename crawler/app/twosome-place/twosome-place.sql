INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('twosome-place', '투썸플레이스', 'A TWOSOME PLACE', NULL, TRUE);

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
        'twosome-place-beverage',
        'twosome-place',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'twosome-place-food',
        'twosome-place',
        NULL,
        '푸드',
        1,
        TRUE
    );

-- 음료 하위 카테고리
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
        'twosome-place-beverage-coffee',
        'twosome-place',
        'twosome-place-beverage',
        '커피',
        0,
        TRUE
    ),
    (
        'twosome-place-beverage-beverage',
        'twosome-place',
        'twosome-place-beverage',
        '음료',
        1,
        TRUE
    ),
    (
        'twosome-place-beverage-tea',
        'twosome-place',
        'twosome-place-beverage',
        '티/티라떼',
        2,
        TRUE
    ),
    (
        'twosome-place-beverage-ice-cream',
        'twosome-place',
        'twosome-place-beverage',
        '아이스크림/빙수',
        3,
        TRUE
    );

-- 푸드 하위 카테고리
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
        'twosome-place-food-piece-cake',
        'twosome-place',
        'twosome-place-food',
        '피스케이크',
        0,
        TRUE
    ),
    (
        'twosome-place-food-macaron',
        'twosome-place',
        'twosome-place-food',
        '마카롱',
        1,
        TRUE
    ),
    (
        'twosome-place-food-whole-cake',
        'twosome-place',
        'twosome-place-food',
        '홀케이크',
        2,
        TRUE
    ),
    (
        'twosome-place-food-snack',
        'twosome-place',
        'twosome-place-food',
        '스낵',
        3,
        TRUE
    ),
    (
        'twosome-place-food-sandwich',
        'twosome-place',
        'twosome-place-food',
        '샌드위치',
        4,
        TRUE
    ),
    (
        'twosome-place-food-salad',
        'twosome-place',
        'twosome-place-food',
        '샐러드/기타',
        5,
        TRUE
    ),
    (
        'twosome-place-food-bakery',
        'twosome-place',
        'twosome-place-food',
        '베이커리',
        6,
        TRUE
    );
