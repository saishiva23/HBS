# Hotel Booking System - Complete Testing Checklist

## Pre-Testing Setup
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] MySQL database running with correct password (root/root)
- [ ] .NET Invoice Service running on http://localhost:5000 (optional)

---

## 🔵 CUSTOMER TESTING

### 1. Registration & Login
- [ ] **Register New Customer**
  - Go to `/register`
  - Fill: First Name, Last Name, Email, Password, DOB, Phone, Address
  - Click "Register"
  - ✅ Expected: Success message, redirect to login
  - 🔍 Check Database: `SELECT * FROM users WHERE email='test@example.com'`

- [ ] **Login as Customer**
  - Email: `user@stays.in` / Password: `password123`
  - ✅ Expected: Redirect to home, see user name in navbar
  - 🔍 Check: JWT token stored in localStorage

### 2. Hotel Search & Browse
- [ ] **Search Hotels**
  - Search for "Mumbai" or "Jaipur"
  - ✅ Expected: See hotels from database (Taj Lands End, The Grand Palace)
  - ❌ Should NOT see: JW Marriott Pune or any mock data

- [ ] **View Hotel Details**
  - Click on a hotel
  - ✅ Expected: See hotel details, room types, prices
  - 🔍 Check: Hotel added to recently_viewed table
  - 🔍 Database: `SELECT * FROM recently_viewed WHERE user_id=?`

- [ ] **Recently Viewed**
  - Go back to home page
  - ✅ Expected: See "Recently viewed" section with hotel you just viewed
  - ❌ Should NOT see: Mock hotels

### 3. Booking Flow
- [ ] **Add to Cart**
  - Select dates, guests, rooms
  - Click "Add to Cart"
  - ✅ Expected: Success toast, cart count increases
  - 🔍 Check: localStorage 'hotelCart' has item

- [ ] **View Cart**
  - Click cart icon
  - ✅ Expected: See booking details, can edit rooms/dates
  - Test: Increase/decrease room count
  - Test: Edit dates

- [ ] **Checkout**
  - Click "Proceed to Checkout"
  - Fill guest details (if not auto-filled)
  - Select payment method
  - Click "Confirm Booking"
  - ✅ Expected: Booking confirmed, redirect to bookings page
  - 🔍 Database: `SELECT * FROM bookings WHERE user_id=?`
  - 🔍 Database: `SELECT * FROM room_occupancy WHERE booking_id=?`
  - 🔍 Database: `SELECT * FROM rooms WHERE status='OCCUPIED'`

### 4. My Bookings
- [ ] **View Bookings**
  - Go to "My Bookings"
  - ✅ Expected: See confirmed booking with:
    - Hotel name, room type
    - Check-in/out dates
    - Total price
    - Room numbers assigned (e.g., "RT6-001, RT6-002")
    - Status: CONFIRMED

- [ ] **Download Invoice**
  - Click "Download Invoice" button
  - ✅ Expected: PDF downloads with booking details
  - ⚠️ Requires: .NET service running on port 5000

- [ ] **Cancel Booking**
  - Click "Cancel Booking"
  - Confirm cancellation
  - ✅ Expected: Status changes to CANCELLED
  - 🔍 Database: `SELECT status FROM bookings WHERE id=?` (should be CANCELLED)
  - 🔍 Database: `SELECT status FROM rooms WHERE id=?` (should be AVAILABLE again)
  - 🔍 Database: `SELECT * FROM room_occupancy WHERE booking_id=?` (should be cancelled)

### 5. Reviews
- [ ] **Add Review**
  - Go to completed booking
  - Click "Write Review"
  - Fill: Rating (1-5 stars), Title, Comment
  - Submit
  - ✅ Expected: Review added
  - 🔍 Database: `SELECT * FROM reviews WHERE booking_id=?`

### 6. Complaints
- [ ] **Submit Complaint**
  - Go to "Complaints" or booking details
  - Click "File Complaint"
  - Fill: Subject, Description
  - Submit
  - ✅ Expected: Complaint submitted, status PENDING
  - 🔍 Database: `SELECT * FROM complaints WHERE user_id=?`

### 7. Profile Management
- [ ] **View Profile**
  - Click profile icon → "Profile"
  - ✅ Expected: See personal details

- [ ] **Update Profile**
  - Edit: Phone, Address
  - Save changes
  - ✅ Expected: Success message
  - 🔍 Database: `SELECT phone, address FROM users WHERE id=?`

---

## 🟢 HOTEL OWNER TESTING

### 1. Owner Registration & Login
- [ ] **Register as Hotel Owner**
  - Go to `/hoteliers`
  - Fill all fields including hotel details
  - ✅ Expected: Owner account + hotel created
  - 🔍 Database: `SELECT * FROM users WHERE user_role='ROLE_HOTEL_MANAGER'`
  - 🔍 Database: `SELECT * FROM hotels WHERE owner_id=?`

- [ ] **Login as Owner**
  - Email: `owner@stays.in` / Password: `owner123`
  - ✅ Expected: Redirect to owner dashboard

### 2. Hotel Management
- [ ] **View My Hotels**
  - Dashboard shows list of hotels
  - ✅ Expected: See hotels owned by this user
  - Status: PENDING (if new) or APPROVED

- [ ] **Edit Hotel Profile**
  - Click "Edit Hotel"
  - Update: Description, Amenities, Contact info
  - Save
  - ✅ Expected: Changes saved
  - 🔍 Database: `SELECT * FROM hotels WHERE id=?`

- [ ] **Add Hotel Images**
  - Go to Hotel Profile Management
  - Add Google Drive image links
  - ✅ Expected: Images stored as JSON array
  - 🔍 Database: `SELECT images FROM hotels WHERE id=?`

### 3. Room Type Management
- [ ] **Add Room Type**
  - Go to "Room Types"
  - Click "Add Room Type"
  - Fill: Name, Description, Price, Capacity, Total Rooms, Beds
  - Add images (Google Drive links)
  - Save
  - ✅ Expected: Room type created
  - 🔍 Database: `SELECT * FROM room_types WHERE hotel_id=?`

- [ ] **Edit Room Type**
  - Edit existing room type
  - Change price or description
  - Save
  - ✅ Expected: Changes saved

- [ ] **Delete Room Type**
  - Delete a room type
  - ✅ Expected: Soft delete (is_deleted=true)
  - 🔍 Database: `SELECT is_deleted FROM room_types WHERE id=?`

### 4. Room Management
- [ ] **View Rooms**
  - Go to "Rooms"
  - ✅ Expected: See all rooms with status (AVAILABLE/OCCUPIED)
  - See room numbers (e.g., RT6-001, RT6-002)

- [ ] **Check Room Assignments**
  - View bookings
  - ✅ Expected: See which rooms are assigned to which bookings
  - 🔍 Database: `SELECT * FROM room_occupancy WHERE hotel_id=?`

### 5. Booking Management
- [ ] **View Bookings**
  - Go to "Bookings"
  - ✅ Expected: See all bookings for my hotels
  - Filter by status: All, Confirmed, Cancelled, Completed

- [ ] **View Booking Details**
  - Click on a booking
  - ✅ Expected: See guest details, room assignments, payment info

### 6. Reviews Management
- [ ] **View Reviews**
  - Go to "Reviews"
  - ✅ Expected: See reviews for my hotels
  - Can respond to reviews (if implemented)

### 7. Revenue Reports
- [ ] **View Revenue**
  - Go to "Revenue Reports"
  - ✅ Expected: See earnings, booking statistics
  - Filter by date range

---

## 🔴 ADMIN TESTING

### 1. Admin Login
- [ ] **Login as Admin**
  - Email: `admin@stays.in` / Password: `admin123`
  - ✅ Expected: Redirect to admin dashboard

### 2. Dashboard Overview
- [ ] **View Dashboard**
  - ✅ Expected: See statistics:
    - Total hotels, bookings, users
    - Revenue metrics
    - Recent activities

### 3. Hotel Approvals
- [ ] **View Pending Hotels**
  - Go to "Hotel Approvals"
  - ✅ Expected: See hotels with status PENDING
  - 🔍 Database: `SELECT * FROM hotels WHERE status='PENDING'`

- [ ] **Approve Hotel**
  - Click "Approve" on a pending hotel
  - ✅ Expected: Status changes to APPROVED
  - 🔍 Database: `SELECT status FROM hotels WHERE id=?`
  - Hotel now visible to customers

- [ ] **Reject Hotel**
  - Click "Reject"
  - ✅ Expected: Status changes to REJECTED
  - Hotel NOT visible to customers

### 4. User Management
- [ ] **View All Users**
  - Go to "Customer Management"
  - ✅ Expected: See all users (customers, owners)
  - 🔍 Database: `SELECT * FROM users`

- [ ] **Suspend User**
  - Click "Suspend" on a user
  - ✅ Expected: account_status = SUSPENDED
  - 🔍 Database: `SELECT account_status FROM users WHERE id=?`
  - User cannot login

- [ ] **Activate User**
  - Click "Activate" on suspended user
  - ✅ Expected: account_status = ACTIVE
  - User can login again

### 5. Booking Management
- [ ] **View All Bookings**
  - Go to "Booking Management"
  - ✅ Expected: See ALL bookings from all hotels
  - Filter by status, date, hotel

- [ ] **Cancel Booking (Admin)**
  - Admin can cancel any booking
  - ✅ Expected: Booking cancelled, rooms freed

### 6. Complaints Management
- [ ] **View All Complaints**
  - Go to "Customer Experience" → "Complaints"
  - ✅ Expected: See all complaints
  - Status: PENDING, IN_PROGRESS, RESOLVED

- [ ] **Resolve Complaint**
  - Click "Resolve" on a complaint
  - Add resolution notes
  - ✅ Expected: Status = RESOLVED
  - 🔍 Database: `SELECT status FROM complaints WHERE id=?`

### 7. Location Management
- [ ] **Add Location**
  - Go to "Location Management"
  - Add new city/state
  - ✅ Expected: Location added
  - 🔍 Database: `SELECT * FROM locations`

### 8. System Analytics
- [ ] **View Analytics**
  - Go to "System Analytics"
  - ✅ Expected: See:
    - Booking trends
    - Revenue charts
    - Popular destinations
    - User growth

### 9. Reviews Management
- [ ] **View All Reviews**
  - Go to "Reviews Management"
  - ✅ Expected: See all reviews across all hotels
  - Can delete inappropriate reviews

---

## 🔧 TECHNICAL VERIFICATION

### Database Sync Checks
```sql
-- Check user creation
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

-- Check hotel creation
SELECT * FROM hotels ORDER BY created_at DESC LIMIT 5;

-- Check bookings
SELECT b.*, h.name as hotel_name, u.email as user_email 
FROM bookings b 
JOIN hotels h ON b.hotel_id = h.id 
JOIN users u ON b.user_id = u.id 
ORDER BY b.booking_date DESC LIMIT 5;

-- Check room assignments
SELECT ro.*, r.room_number, b.booking_reference 
FROM room_occupancy ro 
JOIN rooms r ON ro.room_id = r.id 
JOIN bookings b ON ro.booking_id = b.id 
ORDER BY ro.created_at DESC LIMIT 10;

-- Check room status
SELECT r.*, rt.name as room_type_name 
FROM rooms r 
JOIN room_types rt ON r.room_type_id = rt.id 
WHERE r.status = 'OCCUPIED';

-- Check recently viewed
SELECT rv.*, h.name as hotel_name, u.email as user_email 
FROM recently_viewed rv 
JOIN hotels h ON rv.hotel_id = h.id 
JOIN users u ON rv.user_id = u.id 
ORDER BY rv.viewed_at DESC LIMIT 10;
```

### API Endpoint Tests
```bash
# Test hotel search
curl http://localhost:8080/api/hotels

# Test hotel by city
curl http://localhost:8080/api/hotels/search?city=Mumbai

# Test authentication (should fail without token)
curl http://localhost:8080/api/bookings/my-bookings

# Test with token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/api/bookings/my-bookings
```

---

## 📊 TEST RESULTS TEMPLATE

### Customer Flow: ⬜ PASS / ⬜ FAIL
- Registration: ⬜
- Login: ⬜
- Search: ⬜
- Booking: ⬜
- Cart: ⬜
- Checkout: ⬜
- Room Assignment: ⬜
- Invoice Download: ⬜
- Cancellation: ⬜
- Reviews: ⬜
- Complaints: ⬜

### Owner Flow: ⬜ PASS / ⬜ FAIL
- Registration: ⬜
- Hotel Management: ⬜
- Room Types: ⬜
- Room Management: ⬜
- Booking View: ⬜
- Revenue Reports: ⬜

### Admin Flow: ⬜ PASS / ⬜ FAIL
- Dashboard: ⬜
- Hotel Approvals: ⬜
- User Management: ⬜
- Booking Management: ⬜
- Complaints: ⬜
- Analytics: ⬜

### Database Sync: ⬜ PASS / ⬜ FAIL
- User data: ⬜
- Hotel data: ⬜
- Booking data: ⬜
- Room assignments: ⬜
- Reviews: ⬜
- Complaints: ⬜

---

## 🐛 Known Issues to Check
1. [ ] Room numbers display correctly in bookings
2. [ ] Room status updates when booking cancelled
3. [ ] Recently viewed shows only real hotels
4. [ ] No mock data appears anywhere
5. [ ] Toast notifications work (not alerts)
6. [ ] Google Drive images display correctly
7. [ ] Date picker works for DOB (no 18+ restriction)
8. [ ] Price range displays with ₹ symbol
9. [ ] Autocomplete search works
10. [ ] Booking cancellation notifications appear

---

**Testing Date**: _____________
**Tester**: _____________
**Backend Version**: Spring Boot 3.5.9
**Frontend Version**: React + Vite
**Database**: MySQL 8.0
