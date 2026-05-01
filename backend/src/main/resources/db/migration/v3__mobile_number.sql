-- V2__add_mobile_number_to_participation.sql

-- 1. Add column (nullable first)
ALTER TABLE participation
ADD COLUMN mobile_number VARCHAR(20);

-- 2. Backfill existing rows (adjust logic if needed)
UPDATE participation
SET mobile_number = '0000000000'
WHERE mobile_number IS NULL;

-- 3. Make it NOT NULL
ALTER TABLE participation
ALTER COLUMN mobile_number SET NOT NULL;