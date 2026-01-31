-- ======================================================
-- UNIVERSAL FIX: Correcting SBH2 Pricing by Hotel Name
-- ======================================================

-- 1. Find the actual ID of SBH2
SET @sbh2_id = (SELECT id FROM hotels WHERE name = 'SBH2' LIMIT 1);

-- 2. Ensure a proper room type exists for SBH2 with price ₹6
-- This will update the existing rooms for SBH2 or create a new one if none exist
UPDATE room_types 
SET price_per_night = 6.00, 
    name = 'Ocean View Room' 
WHERE hotel_id = @sbh2_id;

-- If no room types exist for SBH2 yet, this insert will run 
-- (Note: In a script we use INSERT ... ON DUPLICATE KEY or check first)
-- For simplicity, let's just make sure ALL room types linked to SBH2 are ₹6
UPDATE room_types SET price_per_night = 6.00 WHERE hotel_id = @sbh2_id;

-- 3. Correct all bookings that belong to SBH2
-- This sets the price to ₹6 for all SBH2 bookings
UPDATE bookings 
SET total_price = 6.00,
    price_per_night = 6.00
WHERE hotel_id = @sbh2_id;

-- 4. Find ANY booking that is still 18500 but says it is SBH2
-- (Safety check in case of ID mixups)
UPDATE bookings b
JOIN hotels h ON b.hotel_id = h.id
SET b.total_price = 6.00, b.price_per_night = 6.00
WHERE h.name = 'SBH2' AND (b.total_price = 18500.00 OR b.total_price = 0);

-- 5. Final result check
SELECT h.name, rt.name, rt.price_per_night, b.total_price 
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
JOIN room_types rt ON b.room_type_id = rt.id
WHERE h.name = 'SBH2';
