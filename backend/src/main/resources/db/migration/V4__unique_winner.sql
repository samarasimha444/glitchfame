ALTER TABLE winner
ADD CONSTRAINT unique_winner_season
UNIQUE (season_name);