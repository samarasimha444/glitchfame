-- VXX__add_votes_kills_score.sql

-- 1. Add votes column
ALTER TABLE participation
ADD COLUMN votes INTEGER NOT NULL DEFAULT 0;

-- 2. Add kills column
ALTER TABLE participation
ADD COLUMN kills INTEGER NOT NULL DEFAULT 0;

-- 3. Add score as generated column
ALTER TABLE participation
ADD COLUMN score INTEGER GENERATED ALWAYS AS (votes - kills * 1000) STORED;
CREATE INDEX idx_participation_score
ON participation(score DESC);