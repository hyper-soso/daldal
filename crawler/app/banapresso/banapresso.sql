INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('banapresso', '바나프레소', 'BANAPRESSO', NULL, TRUE);

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
        'banapresso-beverage',
        'banapresso',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'banapresso-food',
        'banapresso',
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
        'banapresso-beverage-coffee',
        'banapresso',
        'banapresso-beverage',
        '커피',
        0,
        TRUE
    ),
    (
        'banapresso-beverage-decaf',
        'banapresso',
        'banapresso-beverage',
        '디카페인 커피',
        1,
        TRUE
    ),
    (
        'banapresso-beverage-latte',
        'banapresso',
        'banapresso-beverage',
        '라떼',
        2,
        TRUE
    ),
    (
        'banapresso-beverage-low-sugar',
        'banapresso',
        'banapresso-beverage',
        '저당&제로슈가',
        3,
        TRUE
    ),
    (
        'banapresso-beverage-juice-drink',
        'banapresso',
        'banapresso-beverage',
        '주스 & 드링크',
        4,
        TRUE
    ),
    (
        'banapresso-beverage-banaccino',
        'banapresso',
        'banapresso-beverage',
        '바나치노 & 스무디',
        5,
        TRUE
    ),
    (
        'banapresso-beverage-tea-ade',
        'banapresso',
        'banapresso-beverage',
        '티 & 에이드',
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
        'banapresso-food-ice-cream',
        'banapresso',
        'banapresso-food',
        'ICE CREAM',
        0,
        TRUE
    ),
    (
        'banapresso-food-dessert',
        'banapresso',
        'banapresso-food',
        '디저트',
        1,
        TRUE
    );
