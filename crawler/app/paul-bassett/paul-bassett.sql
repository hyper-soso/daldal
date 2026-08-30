INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('paul-bassett', '폴바셋', 'PAUL BASSETT', NULL, TRUE);

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
        'paul-bassett-beverage',
        'paul-bassett',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'paul-bassett-food',
        'paul-bassett',
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
        'paul-bassett-beverage-espresso',
        'paul-bassett',
        'paul-bassett-beverage',
        'Espresso',
        0,
        TRUE
    ),
    (
        'paul-bassett-beverage-coffee',
        'paul-bassett',
        'paul-bassett-beverage',
        'Coffee',
        1,
        TRUE
    ),
    (
        'paul-bassett-beverage-latte',
        'paul-bassett',
        'paul-bassett-beverage',
        'Latte',
        2,
        TRUE
    ),
    (
        'paul-bassett-beverage-cold-brew',
        'paul-bassett',
        'paul-bassett-beverage',
        'Cold Brew',
        3,
        TRUE
    ),
    (
        'paul-bassett-beverage-single-origin',
        'paul-bassett',
        'paul-bassett-beverage',
        'Single Origin',
        4,
        TRUE
    ),
    (
        'paul-bassett-beverage-decaf',
        'paul-bassett',
        'paul-bassett-beverage',
        'Decaf',
        5,
        TRUE
    ),
    (
        'paul-bassett-beverage-frappe',
        'paul-bassett',
        'paul-bassett-beverage',
        'Frappe',
        6,
        TRUE
    ),
    (
        'paul-bassett-beverage-ade-juice',
        'paul-bassett',
        'paul-bassett-beverage',
        'Ade · Juice',
        7,
        TRUE
    ),
    (
        'paul-bassett-beverage-tea',
        'paul-bassett',
        'paul-bassett-beverage',
        'Tea',
        8,
        TRUE
    ),
    (
        'paul-bassett-beverage-tea-latte',
        'paul-bassett',
        'paul-bassett-beverage',
        'Tea Latte',
        9,
        TRUE
    ),
    (
        'paul-bassett-beverage-chocolate',
        'paul-bassett',
        'paul-bassett-beverage',
        'Chocolate',
        10,
        TRUE
    ),
    (
        'paul-bassett-beverage-yogurt',
        'paul-bassett',
        'paul-bassett-beverage',
        'Yogurt',
        11,
        TRUE
    ),
    (
        'paul-bassett-beverage-ice-cream-latte',
        'paul-bassett',
        'paul-bassett-beverage',
        '아이스크림 라떼',
        12,
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
        'paul-bassett-food-ice-cream-topping',
        'paul-bassett',
        'paul-bassett-food',
        '토핑 아이스크림',
        0,
        TRUE
    ),
    (
        'paul-bassett-food-ice-cream-cone',
        'paul-bassett',
        'paul-bassett-food',
        '아이스크림 콘',
        1,
        TRUE
    ),
    (
        'paul-bassett-food-ice-cream-cup',
        'paul-bassett',
        'paul-bassett-food',
        '아이스크림 컵',
        2,
        TRUE
    ),
    (
        'paul-bassett-food-snack',
        'paul-bassett',
        'paul-bassett-food',
        '스낵',
        3,
        TRUE
    ),
    (
        'paul-bassett-food-cake',
        'paul-bassett',
        'paul-bassett-food',
        '케이크',
        4,
        TRUE
    ),
    (
        'paul-bassett-food-meal',
        'paul-bassett',
        'paul-bassett-food',
        '식사대용식',
        5,
        TRUE
    ),
    (
        'paul-bassett-food-bakery',
        'paul-bassett',
        'paul-bassett-food',
        '베이커리',
        6,
        TRUE
    ),
    (
        'paul-bassett-food-pizza-pasta',
        'paul-bassett',
        'paul-bassett-food',
        '피자 · 파스타',
        7,
        TRUE
    );
