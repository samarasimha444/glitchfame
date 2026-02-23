CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(6) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    role ENUM('USER','ADMIN') NOT NULL,
    deleted BIT(1) NOT NULL DEFAULT b'0',

    CONSTRAINT uk_users_email_deleted UNIQUE (email, deleted),
    CONSTRAINT uk_users_mobile_deleted UNIQUE (mobile_number, deleted),
    CONSTRAINT uk_users_username_deleted UNIQUE (username, deleted)
);

CREATE TABLE seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    deleted BIT(1) NOT NULL DEFAULT b'0',
    name VARCHAR(100) NOT NULL,
    prize_money DECIMAL(12,2) NOT NULL,
    registration_start_date DATETIME(6) NOT NULL,
    registration_end_date DATETIME(6) NOT NULL,
    voting_start_date DATETIME(6) NOT NULL,
    voting_end_date DATETIME(6) NOT NULL,
    winner_id BIGINT NULL,

    CONSTRAINT uk_season_name_deleted UNIQUE (name, deleted)
);