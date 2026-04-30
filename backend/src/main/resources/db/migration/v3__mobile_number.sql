-- STEP 1: Add mobile_number (temporarily nullable)
ALTER TABLE participation
ADD COLUMN mobile_number VARCHAR(20);

-- STEP 2: Backfill existing rows
UPDATE participation
SET 
    mobile_number = '0000000000',
    description = COALESCE(description, '');

-- STEP 3: Apply NOT NULL constraints
ALTER TABLE participation
ALTER COLUMN mobile_number SET NOT NULL,
ALTER COLUMN description SET NOT NULL;