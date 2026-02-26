CREATE TABLE auth_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,

    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',

    can_vote BOOLEAN NOT NULL DEFAULT TRUE,
    can_participate BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uk_auth_users_email UNIQUE (email),
    CONSTRAINT uk_auth_users_username UNIQUE (username),
    CONSTRAINT uk_auth_users_mobile UNIQUE (mobile_number)
);





CREATE TABLE seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    prize_money DECIMAL(15,2) NOT NULL,

    registration_start_date DATETIME NOT NULL,
    registration_end_date DATETIME NOT NULL,

    voting_start_date DATETIME NOT NULL,
    voting_end_date DATETIME NOT NULL,
    photo_url VARCHAR(255) DEFAULT NULL,

    CONSTRAINT uk_seasons_name UNIQUE (name)
);





CREATE TABLE participations (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('PENDING','REJECTED','APPROVED') NOT NULL DEFAULT 'PENDING',

    date_of_birth DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_participation_user
        FOREIGN KEY (user_id)
        REFERENCES auth_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_participation_season
        FOREIGN KEY (season_id)
        REFERENCES seasons(id)
        ON DELETE CASCADE,

    -- Prevent duplicate application for same season
    CONSTRAINT uk_user_season UNIQUE (user_id, season_id)
);

-- Indexes
CREATE INDEX idx_participation_location 
ON participations(location);

CREATE INDEX idx_participation_dob 
ON participations(date_of_birth);

CREATE INDEX idx_participation_status 
ON participations(status);

CREATE INDEX idx_participation_name 
ON participations(name);




CREATE TABLE votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    contestant_id BIGINT NOT NULL,
    voter_id BIGINT NOT NULL,

    CONSTRAINT fk_votes_contestant
        FOREIGN KEY (contestant_id)
        REFERENCES participations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_votes_voter
        FOREIGN KEY (voter_id)
        REFERENCES auth_users(id)
        ON DELETE CASCADE,

    -- One voter can vote only once per contestant
    CONSTRAINT uk_votes_unique_vote
        UNIQUE (contestant_id, voter_id)
);

-- Indexes
CREATE INDEX idx_votes_contestant ON votes(contestant_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);