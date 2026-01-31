-- Complete Database Cleanup Script
-- This script removes ALL hardcoded price data (₹18,500, ₹45,000)
-- It preserves user accounts but removes hotels, room types, rooms, and bookings

-- =====================================================
-- STEP 1: Delete dependent records (Foreign Key constraints)
-- =====================================================
DELETE FROM room_occupancy;
DELETE FROM complaints;
DELETE FROM reviews;
DELETE FROM recently_viewed;
SELECT 'Deleted all room occupancy, complaints, reviews, and recently viewed records' AS Status;

-- =====================================================
-- STEP 2: Delete all bookings
-- =====================================================
DELETE FROM bookings;
SELECT 'Deleted all bookings' AS Status;

-- =====================================================
-- STEP 3: Delete all rooms
-- =====================================================
DELETE FROM rooms;
SELECT 'Deleted all rooms' AS Status;

-- =====================================================
-- STEP 4: Delete all room types (contains hardcoded prices)
-- =====================================================
DELETE FROM room_types;
SELECT 'Deleted all room types (hardcoded ₹18,500, ₹45,000 removed)' AS Status;

-- =====================================================
-- STEP 5: Delete all hotels (Images are stored in this table as JSON)
-- =====================================================
DELETE FROM hotels;
SELECT 'Deleted all hotels' AS Status;

-- =====================================================
-- STEP 6: Delete all locations
-- =====================================================
DELETE FROM locations;
SELECT 'Deleted all locations' AS Status;

-- =====================================================
-- VERIFICATION: Check counts
-- =====================================================
SELECT 'Bookings' AS Table_Name, COUNT(*) AS Remaining_Records FROM bookings
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Room Types', COUNT(*) FROM room_types
UNION ALL
SELECT 'Hotels', COUNT(*) FROM hotels
UNION ALL
SELECT 'Locations', COUNT(*) FROM locations
UNION ALL
SELECT 'Users (Preserved)', COUNT(*) FROM users;

-- =====================================================
-- RESULT: Database is now clean
-- =====================================================

-- All users are preserved:
--   - admin@stays.in / admin123 (Admin)
--   - user@stays.in / password123 (Customer)
--   - owner@stays.in / owner123 (Hotel Manager)
--   - test@test.com / test123 (Test Customer)
--
-- You can now create fresh hotels with real pricing!
-- =====================================================
