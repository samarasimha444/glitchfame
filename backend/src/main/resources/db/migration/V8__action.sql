-- V8__add_action_column_nullable.sql

ALTER TABLE votes
ADD COLUMN action VARCHAR(10);

ALTER TABLE votes
ADD CONSTRAINT check_votes_action
CHECK (action IS NULL OR action IN ('VOTE', 'KILL'));