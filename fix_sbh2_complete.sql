-- ============================================
-- FIX: Create proper room type for SBH2 and fix bookings
-- ============================================

-- Step 1: Create a new room type for SBH2 hotel with price ₹6
INSERT INTO room_types (hotel_id, name, description, price_per_night, capacity, total_rooms)
VALUES (
    3,  -- SBH2 hotel_id
    'Ocean View Room',
    'Comfortable room with ocean view',
    6.00,  -- Price per night: ₹6
    2,     -- Capacity: 2 guests
    10     -- Total rooms available
);

-- Step 2: Get the newly created room type ID
SET @new_room_type_id = LAST_INSERT_ID();

-- Step 3: Update existing bookings to use the correct room type
UPDATE bookings 
SET room_type_id = @new_room_type_id,
    total_price = 6.00  -- 1 day × ₹6 × 1 room = ₹6
WHERE hotel_id = 3;  -- SBH2 bookings

-- Step 4: Verify the changes
SELECT 'Room Types for SBH2:' as info;
SELECT rt.id, rt.name, rt.price_per_night, rt.total_rooms, h.name as hotel_name
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id
WHERE h.id = 3;

SELECT 'Updated Bookings:' as info;
SELECT b.id, b.hotel_id, b.room_type_id, b.total_price, b.rooms,
       h.name as hotel_name, rt.name as room_type_name, rt.price_per_night
FROM bookings b
LEFT JOIN hotels h ON b.hotel_id = h.id
LEFT JOIN room_types rt ON b.room_type_id = rt.id
WHERE b.hotel_id = 3;
