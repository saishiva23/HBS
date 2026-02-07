# API Endpoint Issues and Fixes

## Issues Identified from System Testing

### ❌ Missing Admin Endpoints

The following admin endpoints are being called by the test but **DO NOT EXIST** in the backend:

1. **GET /api/admin/bookings** - Does not exist
   - **Expected:** Get all bookings in the system
   - **Status:** Missing endpoint
   - **Fix Required:** Add to AdminController

2. **GET /api/admin/reviews** - Does not exist
   - **Expected:** Get all reviews in the system
   - **Status:** Missing endpoint
   - **Fix Required:** Add to AdminController

3. **GET /api/admin/complaints** - Exists but in ComplaintController
   - **Actual Location:** GET /api/complaints (with admin auth)
   - **Status:** Endpoint exists, test using wrong path
   - **Fix:** Update test to use correct path

### ✅ Existing Endpoints (Correct Paths)

#### Complaints
- **GET /api/complaints** (with ROLE_ADMIN) - Get all complaints ✅
- **POST /api/complaints** - Create complaint ✅
- **GET /api/complaints/my-complaints** - Get user complaints ✅
- **PATCH /api/complaints/{id}/resolve** - Resolve complaint (admin) ✅

#### Reviews
- **POST /api/reviews** - Create review ✅
- **GET /api/reviews/hotel/{hotelId}** - Get hotel reviews ✅
- **GET /api/reviews/my-reviews** - Get user reviews ✅

#### Availability
- **GET /api/availability/hotel/{hotelId}/room-type/{roomTypeId}** - Check availability ✅
- **GET /api/availability/hotel/{hotelId}/room-type/{roomTypeId}/batch** - Batch availability ✅

#### Recently Viewed
- **POST /api/recently-viewed/hotel/{hotelId}** - Add to recently viewed ✅
- **GET /api/recently-viewed** - Get recently viewed ✅

---

## Required Backend Fixes

### 1. Add Admin Bookings Endpoint

**File:** `springboot_backend_jwt/src/main/java/com/hotel/controller/AdminController.java`

```java
// Booking Management
@GetMapping("/bookings")
@Operation(summary = "Get all bookings", description = "Retrieves all bookings in the system")
@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
    log.info("Getting all bookings");
    return ResponseEntity.ok(adminService.getAllBookings());
}
```

**Service Method Required:**
```java
// In AdminService interface
List<BookingResponseDTO> getAllBookings();

// In AdminServiceImpl
@Override
public List<BookingResponseDTO> getAllBookings() {
    return bookingRepository.findAll().stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());
}
```

### 2. Add Admin Reviews Endpoint

**File:** `springboot_backend_jwt/src/main/java/com/hotel/controller/AdminController.java`

```java
// Review Management
@GetMapping("/reviews")
@Operation(summary = "Get all reviews", description = "Retrieves all reviews in the system")
@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
public ResponseEntity<List<Review>> getAllReviews() {
    log.info("Getting all reviews");
    return ResponseEntity.ok(adminService.getAllReviews());
}

@DeleteMapping("/reviews/{id}")
@Operation(summary = "Delete review", description = "Deletes a review from the system")
@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review deleted successfully")
public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long id) {
    log.info("Deleting review ID: {}", id);
    adminService.deleteReview(id);
    return ResponseEntity.ok(new ApiResponse("Success", "Review deleted successfully"));
}
```

**Service Methods Required:**
```java
// In AdminService interface
List<Review> getAllReviews();
void deleteReview(Long id);

// In AdminServiceImpl
@Override
public List<Review> getAllReviews() {
    return reviewRepository.findAll();
}

@Override
public void deleteReview(Long id) {
    reviewRepository.deleteById(id);
}
```

### 3. Add Admin Complaints Endpoint (Alternative)

**Option A:** Keep in ComplaintController (current implementation) ✅
- Path: GET /api/complaints (with @PreAuthorize("hasAuthority('ROLE_ADMIN')"))
- **This is already implemented correctly**

**Option B:** Add to AdminController for consistency
```java
// Complaint Management
@GetMapping("/complaints")
@Operation(summary = "Get all complaints", description = "Retrieves all complaints in the system")
@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Complaints retrieved successfully")
public ResponseEntity<List<Complaint>> getAllComplaints() {
    log.info("Getting all complaints");
    return ResponseEntity.ok(adminService.getAllComplaints());
}
```

---

## Test Script Corrections

### Update Test to Use Correct Endpoints

**Current (Wrong):**
```javascript
const complaintsResult = await apiCall('/admin/complaints', 'GET', null, token);
```

**Corrected:**
```javascript
const complaintsResult = await apiCall('/complaints', 'GET', null, token);
```

---

## Why Tests Failed

### 1. Check Availability Failed
- **Reason:** Endpoint exists but may have thrown an exception
- **Controller:** Returns error as AvailabilityDTO with success=false
- **Fix:** Check backend logs for actual error

### 2. Add to Recently Viewed Failed
- **Reason:** Endpoint exists, likely authentication or data issue
- **Fix:** Check if user is authenticated and hotel exists

### 3. Create Review Failed
- **Reason:** Endpoint exists, likely validation or data issue
- **Possible causes:**
  - Missing required fields in ReviewDTO
  - Hotel doesn't exist
  - User not authenticated properly
- **Fix:** Check backend logs and ReviewDTO validation

### 4. Get Hotel Reviews Failed
- **Reason:** Endpoint exists, likely no reviews in database
- **Fix:** Check if reviews table has data

### 5. Create Complaint Failed
- **Reason:** Endpoint exists, likely validation issue
- **Possible causes:**
  - Missing required fields in ComplaintDTO
  - Invalid category value
- **Fix:** Check ComplaintDTO validation requirements

### 6. Admin Get All Bookings Failed
- **Reason:** Endpoint doesn't exist
- **Fix:** Add endpoint to AdminController

### 7. Admin Get All Reviews Failed
- **Reason:** Endpoint doesn't exist
- **Fix:** Add endpoint to AdminController

### 8. Admin Get All Complaints Failed
- **Reason:** Test using wrong path
- **Fix:** Use /api/complaints instead of /api/admin/complaints

---

## Implementation Priority

### High Priority (Blocking Admin Features)
1. ✅ Add GET /api/admin/bookings
2. ✅ Add GET /api/admin/reviews

### Medium Priority (Test Corrections)
3. ✅ Update test script to use correct complaint endpoint
4. ✅ Investigate why review/complaint creation fails
5. ✅ Check availability endpoint error handling

### Low Priority (Enhancements)
6. Add more admin management endpoints
7. Add filtering and pagination to admin endpoints
8. Add admin statistics endpoints

---

## Next Steps

1. **Add missing admin endpoints** to AdminController
2. **Add service methods** to AdminService and AdminServiceImpl
3. **Update test script** to use correct endpoints
4. **Check backend logs** for actual errors during failed tests
5. **Verify database** has required tables and data
6. **Re-run tests** after fixes

---

## Database Verification Needed

Check if these tables exist and have proper structure:
- ✅ `bookings` - Exists (test created booking successfully)
- ❓ `reviews` - Check structure and constraints
- ❓ `complaints` - Check structure and constraints
- ✅ `recently_viewed` - Exists (GET works)
- ✅ `room_occupancy` - Exists (availability check attempted)

---

## Summary

**Root Causes:**
1. Missing admin endpoints for bookings and reviews
2. Test using incorrect path for admin complaints
3. Possible validation issues for review/complaint creation
4. Possible data issues (no reviews in database)

**Quick Fixes:**
1. Add 2 endpoints to AdminController
2. Add 3 methods to AdminService
3. Update test script paths
4. Check backend logs for validation errors
