-- Remove generated column first (dependency)
ALTER TABLE participation 
DROP COLUMN IF EXISTS total_votes;

-- Remove vote columns
ALTER TABLE participation 
DROP COLUMN IF EXISTS user_votes;

ALTER TABLE participation 
DROP COLUMN IF EXISTS admin_votes;