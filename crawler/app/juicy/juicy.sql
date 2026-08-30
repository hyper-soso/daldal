INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('juicy', '쥬씨', 'JUICY', NULL, TRUE);

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
        'juicy-beverage',
        'juicy',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'juicy-food',
        'juicy',
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
        'juicy-beverage-fresh-juice',
        'juicy',
        'juicy-beverage',
        'FRESH JUICE',
        0,
        TRUE
    ),
    (
        'juicy-beverage-coffee',
        'juicy',
        'juicy-beverage',
        'COFFEE',
        1,
        TRUE
    ),
    (
        'juicy-beverage-beverage',
        'juicy',
        'juicy-beverage',
        'BEVERAGE',
        2,
        TRUE
    ),
    (
        'juicy-beverage-presso-new',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 NEW & SEASON',
        3,
        TRUE
    ),
    (
        'juicy-beverage-presso-coffee',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 COFFEE',
        4,
        TRUE
    ),
    (
        'juicy-beverage-presso-non-coffee',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 NON COFFEE',
        5,
        TRUE
    ),
    (
        'juicy-beverage-presso-juice',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 JUICE',
        6,
        TRUE
    ),
    (
        'juicy-beverage-presso-tea',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 TEA & ADE',
        7,
        TRUE
    ),
    (
        'juicy-beverage-presso-frappe',
        'juicy',
        'juicy-beverage',
        '쥬씨프레소 FRAPPE & SMOOTHIE',
        8,
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
        'juicy-food-bowl',
        'juicy',
        'juicy-food',
        'BOWL',
        0,
        TRUE
    ),
    (
        'juicy-food-dessert',
        'juicy',
        'juicy-food',
        'DESSERT',
        1,
        TRUE
    ),
    (
        'juicy-food-presso-dessert',
        'juicy',
        'juicy-food',
        '쥬씨프레소 DESSERT',
        2,
        TRUE
    );
