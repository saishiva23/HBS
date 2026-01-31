-- Check what hotels exist
SELECT id, name FROM hotels WHERE name LIKE '%SBH%';

-- Check ALL room types
SELECT rt.id, rt.name, rt.price_per_night, h.name as hotel_name 
FROM room_types rt 
JOIN hotels h ON rt.hotel_id = h.id;

-- Check the actual booking details
SELECT b.id, b.hotel_id, b.room_type_id, b.total_price, 
       h.name as hotel_name, rt.name as room_type_name, rt.price_per_night
FROM bookings b
LEFT JOIN hotels h ON b.hotel_id = h.id
LEFT JOIN room_types rt ON b.room_type_id = rt.id
ORDER BY b.id DESC LIMIT 5;
