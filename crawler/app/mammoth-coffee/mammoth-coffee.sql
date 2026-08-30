INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('mammoth-coffee', '매머드커피', 'MAMMOTH COFFEE', NULL, TRUE);

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
        'mammoth-coffee-beverage',
        'mammoth-coffee',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'mammoth-coffee-food',
        'mammoth-coffee',
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
        'mammoth-coffee-beverage-32oz',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '32oz',
        0,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-coffee',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '커피',
        1,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-cold-brew',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '콜드브루',
        2,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-non-coffee',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '논커피',
        3,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-tea-ade',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '티·에이드',
        4,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-frappe',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        '프라페·블렌디드',
        5,
        TRUE
    ),
    (
        'mammoth-coffee-beverage-rtd',
        'mammoth-coffee',
        'mammoth-coffee-beverage',
        'RTD',
        6,
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
        'mammoth-coffee-food-food',
        'mammoth-coffee',
        'mammoth-coffee-food',
        '푸드',
        0,
        TRUE
    ),
    (
        'mammoth-coffee-food-md',
        'mammoth-coffee',
        'mammoth-coffee-food',
        'MD',
        1,
        TRUE
    );
