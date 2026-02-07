-- Add frozen pricing columns to bookings table
-- This ensures prices at booking time are preserved even if hotel/room prices change

ALTER TABLE bookings 
ADD COLUMN price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Frozen price per night at booking time',
ADD COLUMN nights INT COMMENT 'Number of nights calculated at booking time',
ADD COLUMN base_amount DECIMAL(10,2) COMMENT 'Base amount = pricePerNight * nights * rooms';

-- Update existing bookings with calculated values (if any exist)
UPDATE bookings b
JOIN room_types rt ON b.room_type_id = rt.id
SET 
    b.price_per_night = rt.price_per_night,
    b.nights = DATEDIFF(b.check_out_date, b.check_in_date),
    b.base_amount = rt.price_per_night * DATEDIFF(b.check_out_date, b.check_in_date) * b.rooms
WHERE b.price_per_night = 0.00;
