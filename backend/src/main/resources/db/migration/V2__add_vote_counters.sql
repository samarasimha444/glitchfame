-- remove old total_votes column
ALTER TABLE participation
DROP COLUMN IF EXISTS total_votes;

-- add vote counters with default 0
ALTER TABLE participation
ADD COLUMN user_votes INTEGER NOT NULL DEFAULT 0,
ADD COLUMN admin_votes INTEGER NOT NULL DEFAULT 0;

-- total votes generated automatically
ALTER TABLE participation
ADD COLUMN total_votes INTEGER GENERATED ALWAYS AS (user_votes + admin_votes) STORED;