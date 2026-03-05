-- auth_users table
CREATE TABLE auth_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,

    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',

    can_vote BOOLEAN NOT NULL DEFAULT TRUE,
    can_participate BOOLEAN NOT NULL DEFAULT TRUE,

    profile_picture VARCHAR(500) NOT NULL
        DEFAULT 'https://res.cloudinary.com/demo/image/upload/v1/default_profile.png',

    CONSTRAINT uk_auth_users_email UNIQUE (email),
    CONSTRAINT uk_auth_users_username UNIQUE (username),
    CONSTRAINT uk_auth_users_mobile UNIQUE (mobile_number)
);


-- seasons table
CREATE TABLE seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prize_money DECIMAL(15,2) NOT NULL,

    registration_start_date DATETIME NOT NULL,
    registration_end_date DATETIME NOT NULL,

    voting_start_date DATETIME NOT NULL,
    voting_end_date DATETIME NOT NULL,

    photo_url VARCHAR(255) DEFAULT NULL,

    vote_lock BOOLEAN NOT NULL DEFAULT FALSE,
    participation_lock BOOLEAN NOT NULL DEFAULT FALSE,
    season_lock BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uk_seasons_name UNIQUE (name)
);


-- participations table
CREATE TABLE participations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    status ENUM('PENDING','REJECTED','APPROVED')
        NOT NULL DEFAULT 'PENDING',

    date_of_birth DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_participation_user
        FOREIGN KEY (user_id)
        REFERENCES auth_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_participation_season
        FOREIGN KEY (season_id)
        REFERENCES seasons(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_user_season UNIQUE (user_id, season_id)
);

CREATE INDEX idx_participation_location
ON participations(location);

CREATE INDEX idx_participation_dob
ON participations(date_of_birth);

CREATE INDEX idx_participation_status
ON participations(status);

CREATE INDEX idx_participation_name
ON participations(name);


-- votes table
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

    CONSTRAINT uk_votes_unique_vote
        UNIQUE (contestant_id, voter_id)
);

CREATE INDEX idx_votes_contestant ON votes(contestant_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);


-- admin_votes table
CREATE TABLE admin_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    participation_id BIGINT NOT NULL,
    admin_vote_count INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_admin_votes_participation
        FOREIGN KEY (participation_id)
        REFERENCES participations(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_admin_votes_participation
        UNIQUE (participation_id)
);






-- season winners

CREATE TABLE season_winners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    season_id BIGINT NOT NULL,
    season_name VARCHAR(100),

    contestant_id BIGINT NOT NULL,
    contestant_name VARCHAR(100),

    photo_url VARCHAR(255),

    prize_money DECIMAL(15,2),

    total_votes INT,

    CONSTRAINT fk_winner_season
        FOREIGN KEY (season_id)
        REFERENCES seasons(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_winner_contestant
        FOREIGN KEY (contestant_id)
        REFERENCES participations(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_season_winner UNIQUE (season_id)
);


CREATE INDEX idx_winner_season
ON season_winners(season_id);