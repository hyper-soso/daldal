INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('hollys', '할리스', 'HOLLYS', NULL, TRUE);

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
        'hollys-beverage',
        'hollys',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'hollys-food',
        'hollys',
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
        'hollys-beverage-coffee',
        'hollys',
        'hollys-beverage',
        'COFFEE',
        0,
        TRUE
    ),
    (
        'hollys-beverage-signature',
        'hollys',
        'hollys-beverage',
        '라떼 · 초콜릿 · 티',
        1,
        TRUE
    ),
    (
        'hollys-beverage-hollyccino',
        'hollys',
        'hollys-beverage',
        '할리치노 · 빙수',
        2,
        TRUE
    ),
    (
        'hollys-beverage-juice',
        'hollys',
        'hollys-beverage',
        '스무디 · 주스',
        3,
        TRUE
    ),
    (
        'hollys-beverage-sparkling',
        'hollys',
        'hollys-beverage',
        '스파클링',
        4,
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
        'hollys-food-bakery',
        'hollys',
        'hollys-food',
        '푸드',
        0,
        TRUE
    ),
    (
        'hollys-food-md',
        'hollys',
        'hollys-food',
        'MD식품',
        1,
        TRUE
    );
