-- Fix missing rooms - create rooms that should exist based on room_types.total_rooms

USE hotel_booking_db;

-- First, let's see what we're missing
SELECT 
    rt.id as room_type_id,
    rt.name as room_type_name,
    rt.hotel_id,
    rt.total_rooms as expected_rooms,
    COUNT(r.id) as actual_rooms,
    (rt.total_rooms - COUNT(r.id)) as missing_rooms
FROM room_types rt
LEFT JOIN rooms r ON rt.id = r.room_type_id
GROUP BY rt.id, rt.name, rt.hotel_id, rt.total_rooms
HAVING missing_rooms > 0;

-- Create missing rooms for room_type_id 6 (Standard - Hotel 5)
INSERT INTO rooms (hotel_id, room_type_id, room_number, is_active, status)
VALUES (5, 6, 'RT6-002', 1, 'AVAILABLE');

-- Create missing rooms for room_type_id 7 (Standard AC - Hotel 5)
INSERT INTO rooms (hotel_id, room_type_id, room_number, is_active, status)
VALUES 
    (5, 7, 'RT7-001', 1, 'AVAILABLE'),
    (5, 7, 'RT7-002', 1, 'AVAILABLE');

-- Verify the fix
SELECT 
    rt.id as room_type_id,
    rt.name as room_type_name,
    rt.hotel_id,
    rt.total_rooms as expected_rooms,
    COUNT(r.id) as actual_rooms
FROM room_types rt
LEFT JOIN rooms r ON rt.id = r.room_type_id
WHERE rt.hotel_id = 5
GROUP BY rt.id, rt.name, rt.hotel_id, rt.total_rooms;

SELECT 'Missing rooms created successfully!' AS message;
