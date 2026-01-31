-- Database migration script to:
-- 1. Remove suspension_reason and rejection_reason columns
-- 2. Clean up existing NULL values with sensible defaults

USE hotel_booking_db;

-- ================================
-- STEP 1: Fix existing NULL values
-- ================================

-- Fix hotels with NULL location
UPDATE hotels
SET location = CONCAT(city, ', ', IFNULL(state, ''))
WHERE location IS NULL OR location = '';

-- Fix hotels with NULL distance
UPDATE hotels
SET distance_to_center = 'Distance not specified'
WHERE distance_to_center IS NULL OR distance_to_center = '';

-- Fix hotels with NULL rating_text
UPDATE hotels
SET rating_text = CASE
    WHEN rating >= 4.5 THEN 'Exceptional'
    WHEN rating >= 4.0 THEN 'Excellent'
    WHEN rating >= 3.5 THEN 'Very Good'
    WHEN rating >= 3.0 THEN 'Good'
    ELSE 'Not Rated'
END
WHERE rating_text IS NULL OR rating_text = '';

-- Fix hotels with NULL or empty images
UPDATE hotels
SET images = '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60"]'
WHERE images IS NULL OR images = '' OR images = '[]';

-- Fix hotels with NULL price_range
UPDATE hotels
SET price_range = 'Contact for pricing'
WHERE price_range IS NULL OR price_range = '';

-- ================================
-- STEP 2: Drop unnecessary columns
-- ================================

-- Remove suspension_reason from users table (if it exists)
-- Note: This will error if column doesn't exist, which is fine
ALTER TABLE users DROP COLUMN suspension_reason;

-- Remove rejection_reason from hotels table (if it exists)
ALTER TABLE hotels DROP COLUMN rejection_reason;

-- ================================
-- VERIFICATION QUERIES
-- ================================

-- Verify no more NULL values in important hotel fields
SELECT id, name, location, distance_to_center, rating_text, price_range, images
FROM hotels
WHERE location IS NULL 
   OR distance_to_center IS NULL 
   OR rating_text IS NULL 
   OR price_range IS NULL 
   OR images IS NULL
   OR images = ''
   OR images = '[]';

-- Should return 0 rows if successful

-- Verify columns are dropped
SHOW COLUMNS FROM users;
SHOW COLUMNS FROM hotels;
