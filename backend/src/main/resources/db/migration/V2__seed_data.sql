/* =========================================================
   1️⃣ 500 USERS
========================================================= */

INSERT INTO auth_users (email, username, mobile_number, password)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 500
)
SELECT 
    CONCAT('user', n, '@example.com'),
    CONCAT('user', n),
    CONCAT('9', LPAD(n, 9, '0')),
    'password123'
FROM seq;



/* =========================================================
   2️⃣ 6 SEASONS (2 LIVE, 2 PAST, 2 UPCOMING)
========================================================= */

INSERT INTO seasons (
    name, prize_money,
    registration_start_date,
    registration_end_date,
    voting_start_date,
    voting_end_date,
    photo_url
)
VALUES

-- LIVE
('Live Season 1', 200000, NOW()-INTERVAL 10 DAY, NOW()-INTERVAL 5 DAY, NOW()-INTERVAL 2 DAY, NOW()+INTERVAL 5 DAY, 'https://ex.com/live1.jpg'),
('Live Season 2', 220000, NOW()-INTERVAL 10 DAY, NOW()-INTERVAL 5 DAY, NOW()-INTERVAL 2 DAY, NOW()+INTERVAL 5 DAY, 'https://ex.com/live2.jpg'),

-- PAST
('Past Season 1', 180000, NOW()-INTERVAL 60 DAY, NOW()-INTERVAL 50 DAY, NOW()-INTERVAL 45 DAY, NOW()-INTERVAL 30 DAY, 'https://ex.com/past1.jpg'),
('Past Season 2', 190000, NOW()-INTERVAL 60 DAY, NOW()-INTERVAL 50 DAY, NOW()-INTERVAL 45 DAY, NOW()-INTERVAL 30 DAY, 'https://ex.com/past2.jpg'),

-- UPCOMING
('Upcoming Season 1', 250000, NOW()+INTERVAL 10 DAY, NOW()+INTERVAL 20 DAY, NOW()+INTERVAL 25 DAY, NOW()+INTERVAL 35 DAY, 'https://ex.com/up1.jpg'),
('Upcoming Season 2', 260000, NOW()+INTERVAL 10 DAY, NOW()+INTERVAL 20 DAY, NOW()+INTERVAL 25 DAY, NOW()+INTERVAL 35 DAY, 'https://ex.com/up2.jpg');



/* =========================================================
   3️⃣ 3000 PARTICIPATIONS (ALL USERS IN ALL SEASONS)
========================================================= */

INSERT INTO participations
(user_id, season_id, name, description, status, date_of_birth, location, photo_url)

SELECT 
    u.id,
    s.id,
    CONCAT('User', u.id, '_Season', s.id),
    'Mass Participation',
    CASE 
        WHEN s.name LIKE 'Upcoming%' THEN 'PENDING'
        ELSE 'APPROVED'
    END,
    '1995-01-01',
    CASE 
        WHEN u.id % 3 = 0 THEN 'Hyderabad'
        WHEN u.id % 3 = 1 THEN 'Mumbai'
        ELSE 'Delhi'
    END,
    CONCAT('https://ex.com/u', u.id, 's', s.id, '.jpg')
FROM auth_users u
CROSS JOIN seasons s;



/* =========================================================
   4️⃣ HEAVY VOTING
   ~60 votes per approved participation
========================================================= */

INSERT IGNORE INTO votes (contestant_id, voter_id)
SELECT 
    p.id,
    FLOOR(1 + RAND() * 500)
FROM participations p
JOIN (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
    UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
    UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
    UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
    UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
    UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
    UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45
    UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50
    UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 55
    UNION ALL SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL SELECT 60
) x
WHERE p.status = 'APPROVED';



/* =========================================================
   5️⃣ ADMIN BOOST VOTES
========================================================= */

INSERT INTO admin_votes (participation_id, admin_vote_count)
SELECT id, FLOOR(20 + RAND() * 100)
FROM participations
WHERE status = 'APPROVED';