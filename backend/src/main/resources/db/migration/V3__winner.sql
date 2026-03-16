CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE winner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    participant_name VARCHAR(255),
    dob DATE,
    location VARCHAR(255),
    description TEXT,
    participant_photo VARCHAR(500),

    total_votes BIGINT,

    season_name VARCHAR(255),
    season_ending_date TIMESTAMP
);