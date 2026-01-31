# Booking Error Fix Guide

## Problem
You're getting the error: **"Room Type not found with ID: 1"**

## Root Cause
Your cart contains old items with `roomTypeId: 1`, but this room type doesn't exist in the database. The current database has room types with IDs **6** and **7**, not ID 1.

## Solution

### Quick Fix (Recommended)
**Clear your cart and add items again:**

1. Open the application in your browser
2. Go to the Cart page
3. Click the **"Clear All"** button to remove all items
4. Go back to the Home page or Search page
5. Browse hotels and add rooms to cart again
6. The new items will have the correct room type IDs

### Alternative: Clear Browser Storage
If the "Clear All" button doesn't work:

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:5173`
4. Delete the `hotelCart` key
5. Refresh the page

## Why This Happened

The DataLoader was previously disabled, so no room types existed. When you tried to book, the frontend was using a default/hardcoded `roomTypeId: 1`. 

Now that the backend has been restarted with sample data, the room types have different IDs (6 and 7), but your cart still has the old items with ID 1.

## Current Database State

Based on the backend logs, the database now has:
- **Room Type ID 6**: "Standard" (Hotel ID: 5)
- **Room Type ID 7**: "Standard AC" (Hotel ID: 5)

## Verification

To verify what room types exist, you can run:
```sql
SELECT rt.id, rt.name, rt.price_per_night, h.name as hotel_name
FROM room_types rt
JOIN hotels h ON rt.hotel_id = h.id;
```

## Next Steps

After clearing your cart:
1. Browse available hotels
2. Select a room type
3. Add to cart (this will use the correct room type ID)
4. Proceed to checkout
5. Booking should work successfully!

## Technical Details

The booking flow:
1. **HotelDetails.jsx** creates cart items with `roomTypeId: roomType.id`
2. **Cart.jsx** stores items in localStorage
3. **customerAPI.js** sends booking request with the roomTypeId
4. **BookingServiceImpl.java** validates that the room type exists
5. If room type doesn't exist → Error "Room Type not found with ID: X"

The fix ensures that cart items always have valid room type IDs that exist in the database.
