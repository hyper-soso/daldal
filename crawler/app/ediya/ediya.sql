INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('ediya', '이디야커피', "EDIYA COFFEE", NULL, TRUE);

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
    ('ediya-beverage', 'ediya', NULL, '음료', 0, TRUE),
    ('ediya-food', 'ediya', NULL, '푸드', 1, TRUE);

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
        'ediya-beverage-coffee',
        'ediya',
        'ediya-beverage',
        'COFFEE',
        0,
        TRUE
    ),
    (
        'ediya-beverage-beverage',
        'ediya',
        'ediya-beverage',
        'BEVERAGE',
        1,
        TRUE
    ),
    (
        'ediya-beverage-tea',
        'ediya',
        'ediya-beverage',
        'BLENDING TEA',
        2,
        TRUE
    ),
    (
        'ediya-beverage-flatccino',
        'ediya',
        'ediya-beverage',
        'FLATCCINO',
        3,
        TRUE
    ),
    (
        'ediya-beverage-shake',
        'ediya',
        'ediya-beverage',
        'SHAKE & ADE',
        4,
        TRUE
    ),
    (
        'ediya-beverage-bingsu',
        'ediya',
        'ediya-beverage',
        'ICE FLAKES',
        5,
        TRUE
    ),
    (
        'ediya-beverage-rtd',
        'ediya',
        'ediya-beverage',
        'RTD',
        6,
        TRUE
    ),
    (
        'ediya-beverage-ice-cream',
        'ediya',
        'ediya-beverage',
        'ICE CREAM',
        7,
        TRUE
    ),
    (
        'ediya-beverage-decaf',
        'ediya',
        'ediya-beverage',
        'DECAF',
        8,
        TRUE
    ),
    (
        'ediya-beverage-topping',
        'ediya',
        'ediya-beverage',
        'TOPPING',
        9,
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
        'ediya-food-bread',
        'ediya',
        'ediya-food',
        'BREAD',
        0,
        TRUE
    ),
    (
        'ediya-food-dessert',
        'ediya',
        'ediya-food',
        'DESSERT',
        1,
        TRUE
    ),
    (
        'ediya-food-deli',
        'ediya',
        'ediya-food',
        'DELI',
        2,
        TRUE
    ),
    (
        'ediya-food-rte',
        'ediya',
        'ediya-food',
        'RTE',
        3,
        TRUE
    );