# Admin Access - Complete Guide

## ✅ Admin Pages Exist

You have **17 admin pages** in `frontend/src/pages/admin/`:

### Site Admin Pages (ROLE_ADMIN):
1. **SuperAdminDashboard.jsx** - `/admin/dashboard`
2. **HotelApprovals.jsx** - `/admin/approvals`
3. **CustomerManagement.jsx** - `/admin/customers`
4. **SystemAnalytics.jsx** - `/admin/analytics`
5. **PaymentsManagement.jsx** - `/owner/payments` (needs route fix)

### Hotel Owner Pages (ROLE_HOTEL_MANAGER):
6. **HotelierDashboard.jsx** - `/owner/dashboard`
7. **HotelOwnerCRUD.jsx** - `/owner/my-hotels`
8. **HotelProfileManagement.jsx** - `/owner/hotel-profile`
9. **RoomManagement.jsx** - `/owner/rooms`
10. **RoomTypeManagement.jsx** - `/owner/room-types`
11. **BookingManagement.jsx** - `/owner/bookings`
12. **CustomerExperience.jsx** - `/owner/experience`
13. **HotelierSettings.jsx** - `/owner/settings`
14. **PricingAvailability.jsx** - (no route)
15. **RevenueReports.jsx** - (no route)
16. **ReviewsManagement.jsx** - (no route)
17. **LocationManagement.jsx** - (no route)

---

## How to Access Admin Panel

### Step 1: Login as Admin
```
Email: admin@stays.in
Password: admin123
```

### Step 2: Access Admin Panel
**Method 1 - Via Menu Dropdown:**
1. Click on your avatar (top right)
2. Click "Admin Panel" in the dropdown menu
3. You'll be redirected to `/admin/dashboard`

**Method 2 - Direct URL:**
- Navigate directly to: `http://localhost:5173/admin/dashboard`

### Step 3: Navigate Admin Pages
Once in admin panel, use the sidebar to access:
- 📊 Dashboard
- ✅ Hotel Approvals
- 🏨 All Hotels
- 👥 Customers
- 📈 Analytics

---

## Admin Panel Features

### 1. Hotel Approvals (`/admin/approvals`)
**What you can do:**
- ✅ View pending hotel registrations
- ✅ Approve hotels (changes status to APPROVED)
- ✅ Reject hotels with reason (changes status to REJECTED)
- ✅ View approved hotels
- ✅ View rejected hotels with rejection reasons
- ✅ Filter by status (Pending/Approved/Rejected/All)
- ✅ View hotel details (owner info, location, amenities)

**Database Integration:**
- Fetches from: `hotels` table
- Updates: `status` and `rejection_reason` columns
- Joins with: `users` table for owner details

### 2. Payments Management (`/owner/payments`)
**What you can do:**
- ✅ View all bookings/payments
- ✅ See total revenue
- ✅ Track pending payments
- ✅ Track completed payments
- ✅ Track failed transactions
- ✅ View transaction details (ID, guest, date, amount, method, status)
- ✅ Filter by payment status

**Database Integration:**
- Fetches from: `bookings` table
- Displays: `payment_status`, `payment_method`, `transaction_id`, `total_price`
- Joins with: `users` table for guest details

### 3. Customer Management (`/admin/customers`)
**What you can do:**
- ✅ View all users
- ✅ Suspend users with reason
- ✅ Activate suspended users
- ✅ View suspended users list
- ✅ Filter by account status

**Database Integration:**
- Fetches from: `users` table
- Updates: `account_status` and `suspension_reason` columns

---

## Testing Checklist

### ✅ Test Admin Login
```bash
1. Go to http://localhost:5173/login
2. Enter: admin@stays.in / admin123
3. Click "Sign in"
4. Verify you're logged in (avatar appears)
```

### ✅ Test Admin Access
```bash
1. Click avatar (top right)
2. Verify "Admin Panel" option appears
3. Click "Admin Panel"
4. Verify redirect to /admin/dashboard
5. Verify sidebar shows admin menu items
```

### ✅ Test Hotel Approvals
```bash
1. Navigate to /admin/approvals
2. Verify pending hotels load from database
3. Click "Approve" on a hotel
4. Verify hotel moves to "Approved" tab
5. Click "Reject" on a hotel
6. Enter rejection reason
7. Verify hotel moves to "Rejected" tab with reason
```

### ✅ Test Payments Management
```bash
1. Navigate to /owner/payments (or add route /admin/payments)
2. Verify all bookings load
3. Verify stats calculate correctly:
   - Total Revenue
   - Pending Payments
   - Completed Payments
   - Failed Transactions
4. Verify transaction table displays correctly
```

---

## Troubleshooting

### Issue: "Access Denied" when accessing admin pages
**Solution:**
1. Verify you're logged in as admin
2. Check localStorage: `localStorage.getItem('user')`
3. Should show: `{"email":"admin@stays.in","name":"Admin","role":"admin"}`
4. If role is not "admin", logout and login again

### Issue: Admin Panel link not showing in menu
**Solution:**
1. Check user role: `console.log(user?.role)` in browser console
2. Should be: `"admin"`
3. Backend returns role mapping:
   - `ROLE_ADMIN` → `"admin"`
   - `ROLE_HOTEL_MANAGER` → `"owner"`
   - `ROLE_CUSTOMER` → `"user"`

### Issue: Admin pages show empty data
**Solution:**
1. Verify backend is running: `http://localhost:8080`
2. Check browser console for API errors
3. Verify database has data:
   ```sql
   SELECT * FROM hotels WHERE status = 'PENDING';
   SELECT * FROM bookings;
   SELECT * FROM users WHERE role = 'ROLE_ADMIN';
   ```

### Issue: 401 Unauthorized errors
**Solution:**
1. Check JWT token: `localStorage.getItem('token')`
2. Token should exist and be valid
3. If expired, logout and login again
4. Verify backend JWT secret matches

---

## Admin API Endpoints

All admin endpoints require `Authorization: Bearer <token>` header and `ROLE_ADMIN` role.

### Hotel Approvals:
```
GET    /api/admin/hotels/pending
GET    /api/admin/hotels/approved
GET    /api/admin/hotels/rejected
PATCH  /api/admin/hotels/{id}/approve
PATCH  /api/admin/hotels/{id}/reject?reason=...
```

### Payments:
```
GET    /api/admin/payments
GET    /api/admin/payments/pending
GET    /api/admin/payments/completed
GET    /api/admin/payments/failed
```

### Users:
```
GET    /api/admin/users
GET    /api/admin/users/suspended
PATCH  /api/admin/users/{id}/suspend?reason=...
PATCH  /api/admin/users/{id}/activate
```

---

## Database Schema for Admin

### hotels table:
```sql
- id (PRIMARY KEY)
- name
- city
- state
- status (PENDING/APPROVED/REJECTED)
- rejection_reason
- owner_id (FOREIGN KEY → users.id)
- images (JSON)
- amenities (JSON)
```

### bookings table:
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- hotel_id (FOREIGN KEY → hotels.id)
- total_price
- payment_status (PENDING/COMPLETED/FAILED)
- payment_method (CREDIT_CARD/UPI/NET_BANKING)
- transaction_id
```

### users table:
```sql
- id (PRIMARY KEY)
- email
- first_name
- last_name
- role (ROLE_ADMIN/ROLE_HOTEL_MANAGER/ROLE_CUSTOMER)
- account_status (ACTIVE/SUSPENDED)
- suspension_reason
```

---

## Quick Start Commands

```bash
# Start Backend
cd springboot_backend_jwt
mvn spring-boot:run

# Start Frontend (new terminal)
cd frontend
npm run dev

# Access Admin Panel
1. Open: http://localhost:5173
2. Login: admin@stays.in / admin123
3. Click avatar → Admin Panel
4. Navigate to /admin/approvals or /admin/customers
```

---

## Summary

✅ **Admin pages exist** - 17 pages total
✅ **Admin routes configured** - 5 admin routes in App.jsx
✅ **Admin layout working** - Sidebar navigation with role check
✅ **Admin menu link present** - Shows in dropdown for admin users
✅ **Backend APIs ready** - All admin endpoints implemented
✅ **Database integration working** - Real-time data from MySQL

**You CAN access admin pages!** Just login as admin and click "Admin Panel" in the menu dropdown.
