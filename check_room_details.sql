-- Check ALL fields in the room_types table for SBH2
SELECT rt.id, rt.name, rt.description, rt.price_per_night, 
       rt.capacity, rt.total_rooms, rt.amenities, rt.images,
       h.name as hotel_name
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id
WHERE h.id = 3;
