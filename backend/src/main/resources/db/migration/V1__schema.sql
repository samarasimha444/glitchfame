-- Enable extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- AUTH TABLE
-- =========================
CREATE TABLE auth (
    auth_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    can_participate BOOLEAN DEFAULT TRUE,
    can_vote BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SEASON TABLE
-- =========================
CREATE TABLE season (
    season_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description VARCHAR(500),
    prize VARCHAR(200),
    photo_url TEXT,
    registration_start_date TIMESTAMP,
    registration_end_date TIMESTAMP,
    voting_start_date TIMESTAMP,
    voting_end_date TIMESTAMP,
    season_lock BOOLEAN DEFAULT FALSE,
    vote_lock BOOLEAN DEFAULT FALSE,
    participation_lock BOOLEAN DEFAULT FALSE,
    season_ended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PARTICIPATION TABLE
-- =========================
CREATE TABLE participation (
    participation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    auth_id UUID NOT NULL,
    season_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    location VARCHAR(150),
    description VARCHAR(500),

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    photo_url TEXT,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    votes INTEGER NOT NULL DEFAULT 0,
    kills INTEGER NOT NULL DEFAULT 0,

    score INTEGER GENERATED ALWAYS AS (votes - kills * 1000) STORED,

    CONSTRAINT fk_participation_auth
        FOREIGN KEY (auth_id)
        REFERENCES auth(auth_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_participation_season
        FOREIGN KEY (season_id)
        REFERENCES season(season_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_auth_season
        UNIQUE (auth_id, season_id),

    CONSTRAINT check_status
        CHECK (status IN ('PENDING','APPROVED','REJECTED'))
);

-- Indexes
CREATE INDEX idx_participation_auth ON participation(auth_id);
CREATE INDEX idx_participation_season ON participation(season_id);
CREATE INDEX idx_participation_score ON participation(score DESC);

-- =========================
-- VOTES TABLE
-- =========================
CREATE TABLE votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    participation_id UUID NOT NULL,
    auth_id UUID NOT NULL,

    action VARCHAR(10),

    CONSTRAINT fk_votes_participation
        FOREIGN KEY (participation_id)
        REFERENCES participation(participation_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_votes_auth
        FOREIGN KEY (auth_id)
        REFERENCES auth(auth_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vote
        UNIQUE (participation_id, auth_id),

    CONSTRAINT check_votes_action
        CHECK (action IS NULL OR action IN ('VOTE', 'KILL'))
);

-- Indexes
CREATE INDEX idx_votes_participation ON votes(participation_id);
CREATE INDEX idx_votes_auth ON votes(auth_id);

-- =========================
-- WINNER TABLE
-- =========================
CREATE TABLE winner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    participant_name VARCHAR(255),
    dob DATE,
    location VARCHAR(255),
    description TEXT,
    participant_photo VARCHAR(500),

    total_votes BIGINT,

    season_name VARCHAR(255) UNIQUE,
    season_ending_date TIMESTAMP
);