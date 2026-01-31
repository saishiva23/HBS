-- Verify what room types exist in the database
SELECT 
    rt.id as room_type_id,
    rt.name as room_type_name,
    rt.price_per_night,
    rt.total_rooms,
    h.id as hotel_id,
    h.name as hotel_name,
    h.city
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id
ORDER BY rt.id;
