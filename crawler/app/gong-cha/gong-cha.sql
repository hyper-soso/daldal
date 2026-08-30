INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('gong-cha', '공차', 'GONG CHA', NULL, TRUE);

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
        'gong-cha-beverage',
        'gong-cha',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'gong-cha-food',
        'gong-cha',
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
        'gong-cha-beverage-new',
        'gong-cha',
        'gong-cha-beverage',
        'New 시즌 메뉴',
        0,
        TRUE
    ),
    (
        'gong-cha-beverage-best',
        'gong-cha',
        'gong-cha-beverage',
        '베스트셀러',
        1,
        TRUE
    ),
    (
        'gong-cha-beverage-milk-tea',
        'gong-cha',
        'gong-cha-beverage',
        '밀크티',
        2,
        TRUE
    ),
    (
        'gong-cha-beverage-smoothie',
        'gong-cha',
        'gong-cha-beverage',
        '스무디',
        3,
        TRUE
    ),
    (
        'gong-cha-beverage-original-tea',
        'gong-cha',
        'gong-cha-beverage',
        '오리지널 티',
        4,
        TRUE
    ),
    (
        'gong-cha-beverage-fruity',
        'gong-cha',
        'gong-cha-beverage',
        '프룻티&모어',
        5,
        TRUE
    ),
    (
        'gong-cha-beverage-coffee',
        'gong-cha',
        'gong-cha-beverage',
        '커피',
        6,
        TRUE
    ),
    (
        'gong-cha-beverage-yogurty',
        'gong-cha',
        'gong-cha-beverage',
        '요거티',
        7,
        TRUE
    ),
    (
        'gong-cha-beverage-one-liter',
        'gong-cha',
        'gong-cha-beverage',
        '1리터 배달 메뉴',
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
        'gong-cha-food-bakery',
        'gong-cha',
        'gong-cha-food',
        '베이커리',
        0,
        TRUE
    ),
    (
        'gong-cha-food-snack',
        'gong-cha',
        'gong-cha-food',
        '스낵',
        1,
        TRUE
    ),
    (
        'gong-cha-food-ice-cream',
        'gong-cha',
        'gong-cha-food',
        '아이스크림',
        2,
        TRUE
    ),
    (
        'gong-cha-food-md',
        'gong-cha',
        'gong-cha-food',
        'MD식품',
        3,
        TRUE
    );
