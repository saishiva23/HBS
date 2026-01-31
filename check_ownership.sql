-- Check hotel ownership and user details
SELECT h.id as hotel_id, h.name as hotel_name, h.status, h.owner_id,
       u.id as user_id, u.email, u.first_name, u.user_role
FROM hotels h
LEFT JOIN users u ON h.owner_id = u.id
WHERE h.name = 'SBH4';

-- Check what user is associated with owner4@gamil.com (likely the logged-in user)
SELECT id, email, first_name, user_role, account_status
FROM users
WHERE email LIKE '%owner%';
