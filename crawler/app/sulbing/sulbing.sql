INSERT INTO
    cafe (id, name, description, logo_url, is_active)
VALUES
    ('sulbing', '설빙', 'SULBING', NULL, TRUE);

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
        'sulbing-beverage',
        'sulbing',
        NULL,
        '음료',
        0,
        TRUE
    ),
    (
        'sulbing-food',
        'sulbing',
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
        'sulbing-beverage-coffee',
        'sulbing',
        'sulbing-beverage',
        'COFFEE',
        0,
        TRUE
    ),
    (
        'sulbing-beverage-beverage',
        'sulbing',
        'sulbing-beverage',
        'BEVERAGE',
        1,
        TRUE
    ),
    (
        'sulbing-beverage-tea',
        'sulbing',
        'sulbing-beverage',
        'TEA',
        2,
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
        'sulbing-food-special',
        'sulbing',
        'sulbing-food',
        '설빙 SPECIAL',
        0,
        TRUE
    ),
    (
        'sulbing-food-regular',
        'sulbing',
        'sulbing-food',
        '설빙 REGULAR',
        1,
        TRUE
    ),
    (
        'sulbing-food-side',
        'sulbing',
        'sulbing-food',
        '사이드',
        2,
        TRUE
    );
