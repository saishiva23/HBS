-- Fix Frontend Display Data
-- Updates hotel ratings, room prices, and other display issues

-- 1. Update hotel ratings based on reviews
UPDATE hotels SET rating = 5.0, rating_text = 'Excellent', rating_count = 3 WHERE id = 5;

-- 2. Fix room prices (currently showing ₹5 and ₹10 which is unrealistic)
-- SBH1 rooms
UPDATE room_types SET price_per_night = 2500 WHERE id = 6 AND name = 'Standard';
UPDATE room_types SET price_per_night = 3500 WHERE id = 7 AND name = 'Standard AC';

-- 4minar rooms  
UPDATE room_types SET price_per_night = 2000 WHERE hotel_id = 9 AND name = 'Standard';
UPDATE room_types SET price_per_night = 3000 WHERE hotel_id = 9 AND name = 'Deluxe';

-- 3. Update hotel price ranges to match room prices
UPDATE hotels SET price_range = '₹2,500 - ₹3,500' WHERE id = 5;
UPDATE hotels SET price_range = '₹2,000 - ₹3,000' WHERE id = 9;

-- 4. Verify the updates
SELECT 
    h.id,
    h.name,
    h.rating,
    h.rating_text,
    h.rating_count,
    h.price_range,
    COUNT(rt.id) as room_types
FROM hotels h
LEFT JOIN room_types rt ON h.id = rt.hotel_id
WHERE h.status = 'APPROVED'
GROUP BY h.id, h.name, h.rating, h.rating_text, h.rating_count, h.price_range;

-- 5. Show reviews count per hotel
SELECT 
    h.id,
    h.name,
    COUNT(r.id) as review_count,
    AVG(r.rating) as avg_rating
FROM hotels h
LEFT JOIN reviews r ON h.id = r.hotel_id
WHERE h.status = 'APPROVED'
GROUP BY h.id, h.name;
