-- Check Room Type pricing for SBH2
SELECT rt.id, rt.name, rt.price_per_night, h.name as hotel_name 
FROM room_types rt 
JOIN hotels h ON rt.hotel_id = h.id 
WHERE h.name = 'SBH2';

-- Check latest booking for SBH2
SELECT b.id, b.booking_reference, b.total_price, b.check_in_date, b.check_out_date, 
       b.rooms, rt.price_per_night, rt.name as room_type, h.name as hotel
FROM bookings b 
JOIN hotels h ON b.hotel_id = h.id 
JOIN room_types rt ON b.room_type_id = rt.id 
WHERE h.name='SBH2' 
ORDER BY b.id DESC 
LIMIT 1;
