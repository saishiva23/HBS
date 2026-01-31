-- ================================================================
-- COMPREHENSIVE FIX: Update SBH2's priceRange to match room price
-- ================================================================

-- Step 1: Update the priceRange field for SBH2 to show ₹6
UPDATE hotels
SET price_range = '₹6 - ₹10'
WHERE name = 'SBH2';

-- Step 2: Make sure all room types for SBH2 have correct pricing
UPDATE room_types rt
JOIN hotels h ON rt.hotel_id = h.id
SET rt.price_per_night = 6.00
WHERE h.name = 'SBH2';

-- Step 3: Fix ALL existing bookings for SBH2
UPDATE bookings b
JOIN hotels h ON b.hotel_id = h.id
SET b.total_price = 6.00,
    b.price_per_night = 6.00,
    b.base_amount = 6.00
WHERE h.name = 'SBH2';

-- Step 4: Verify the changes
SELECT 'Hotel priceRange:' as check_type, name, price_range 
FROM hotels 
WHERE name = 'SBH2'
UNION ALL
SELECT 'Room Types:', rt.name, CONCAT('₹', rt.price_per_night)
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id
WHERE h.name = 'SBH2'
UNION ALL
SELECT 'Bookings:', CONCAT('Booking ID: ', b.id), CONCAT('₹', b.total_price)
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
WHERE h.name = 'SBH2';
