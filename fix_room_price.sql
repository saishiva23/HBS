-- Update room type price for SBH2 hotel
-- Change price_per_night from 18500 to 6

UPDATE room_types rt
JOIN hotels h ON rt.hotel_id = h.id
SET rt.price_per_night = 6
WHERE h.name = 'SBH2';

-- Verify the update
SELECT rt.id, rt.name, rt.price_per_night, h.name as hotel_name
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id
WHERE h.name = 'SBH2';
