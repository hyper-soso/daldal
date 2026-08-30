INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('tenpercent-coffee', '텐퍼센트커피', 'TENPERCENT COFFEE', NULL, TRUE);

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
        'tenpercent-coffee-beverage',
        'tenpercent-coffee',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'tenpercent-coffee-food',
        'tenpercent-coffee',
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
        'tenpercent-coffee-beverage-signature',
        'tenpercent-coffee',
        'tenpercent-coffee-beverage',
        '시그니처',
        0,
        TRUE
    ),
    (
        'tenpercent-coffee-beverage-coffee',
        'tenpercent-coffee',
        'tenpercent-coffee-beverage',
        '커피',
        1,
        TRUE
    ),
    (
        'tenpercent-coffee-beverage-matcha',
        'tenpercent-coffee',
        'tenpercent-coffee-beverage',
        '말차',
        2,
        TRUE
    ),
    (
        'tenpercent-coffee-beverage-tenup',
        'tenpercent-coffee',
        'tenpercent-coffee-beverage',
        '텐업',
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
        'tenpercent-coffee-food-dessert',
        'tenpercent-coffee',
        'tenpercent-coffee-food',
        '디저트/MD',
        0,
        TRUE
    );
