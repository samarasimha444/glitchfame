/* =========================================================
USERS
100 users + admin + samar
========================================================= */

INSERT INTO auth_users (email, username, mobile_number, password)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 100
)
SELECT
    CONCAT('user', n, '@example.com'),
    CONCAT('user', n),
    CONCAT('9', LPAD(n, 9, '0')),
    '$2a$10$1RizkCusYgLPeRq/q1CCQeAwmb3VOGMoJS15lrLqeHvqXyd3lnp8u'
FROM seq;



INSERT INTO auth_users (email, username, mobile_number, password, role)
VALUES
(
'admin@example.com',
'admin',
'6302519077',
'$2a$10$hl.RZ5oFQDBM/m8tG4eyi.q0WgSfF7DmuuoEuIF0okVMmkkhsuVRC',
'ADMIN'
);


INSERT INTO auth_users (email, username, mobile_number, password)
VALUES
(
'samarasimha124@gmail.com',
'samarasimha124',
'7732048716',
'$2a$10$1RizkCusYgLPeRq/q1CCQeAwmb3VOGMoJS15lrLqeHvqXyd3lnp8u'
);


/* =========================================================
SEASONS
========================================================= */

INSERT INTO seasons
(name, prize_money, registration_start_date, registration_end_date, voting_start_date, voting_end_date, photo_url)

VALUES

-- LIVE (4)
('Live Season 1',200000,NOW()-INTERVAL 20 DAY,NOW()-INTERVAL 10 DAY,NOW()-INTERVAL 2 DAY,NOW()+INTERVAL 5 DAY,'https://ex.com/live1.jpg'),
('Live Season 2',210000,NOW()-INTERVAL 20 DAY,NOW()-INTERVAL 10 DAY,NOW()-INTERVAL 1 DAY,NOW()+INTERVAL 6 DAY,'https://ex.com/live2.jpg'),
('Live Season 3',220000,NOW()-INTERVAL 18 DAY,NOW()-INTERVAL 8 DAY,NOW()-INTERVAL 2 DAY,NOW()+INTERVAL 7 DAY,'https://ex.com/live3.jpg'),
('Live Season 4',230000,NOW()-INTERVAL 18 DAY,NOW()-INTERVAL 8 DAY,NOW()-INTERVAL 1 DAY,NOW()+INTERVAL 8 DAY,'https://ex.com/live4.jpg'),

-- PAST (3)
('Past Season 1',180000,NOW()-INTERVAL 90 DAY,NOW()-INTERVAL 80 DAY,NOW()-INTERVAL 70 DAY,NOW()-INTERVAL 60 DAY,'https://ex.com/past1.jpg'),
('Past Season 2',185000,NOW()-INTERVAL 85 DAY,NOW()-INTERVAL 75 DAY,NOW()-INTERVAL 65 DAY,NOW()-INTERVAL 55 DAY,'https://ex.com/past2.jpg'),
('Past Season 3',190000,NOW()-INTERVAL 80 DAY,NOW()-INTERVAL 70 DAY,NOW()-INTERVAL 60 DAY,NOW()-INTERVAL 50 DAY,'https://ex.com/past3.jpg'),

-- UPCOMING (3)
('Upcoming Season 1',240000,NOW()+INTERVAL 5 DAY,NOW()+INTERVAL 10 DAY,NOW()+INTERVAL 15 DAY,NOW()+INTERVAL 20 DAY,'https://ex.com/up1.jpg'),
('Upcoming Season 2',250000,NOW()+INTERVAL 6 DAY,NOW()+INTERVAL 12 DAY,NOW()+INTERVAL 16 DAY,NOW()+INTERVAL 21 DAY,'https://ex.com/up2.jpg'),
('Upcoming Season 3',260000,NOW()+INTERVAL 7 DAY,NOW()+INTERVAL 13 DAY,NOW()+INTERVAL 17 DAY,NOW()+INTERVAL 22 DAY,'https://ex.com/up3.jpg');



/* =========================================================
PARTICIPATIONS
========================================================= */

INSERT INTO participations
(user_id, season_id, name, description, status, date_of_birth, location, photo_url)

SELECT
u.id,
s.id,
CONCAT('Contestant_',u.id,'_',s.id),
'Seed participation',
CASE
    WHEN s.id BETWEEN 1 AND 4 THEN
        CASE
            WHEN u.id % 4 = 0 THEN 'REJECTED'
            WHEN u.id % 3 = 0 THEN 'PENDING'
            ELSE 'APPROVED'
        END
    ELSE 'APPROVED'
END,
'1995-01-01',
CASE
    WHEN u.id % 3 = 0 THEN 'Hyderabad'
    WHEN u.id % 3 = 1 THEN 'Mumbai'
    ELSE 'Delhi'
END,
CONCAT('https://picsum.photos/seed/',u.id,s.id,'/300/300')

FROM auth_users u
CROSS JOIN seasons s;


/* =========================================================
PAST WINNERS
========================================================= */

