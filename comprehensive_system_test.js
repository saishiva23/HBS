/**
 * COMPREHENSIVE SYSTEM TEST
 * Tests all functionalities for Customer, Admin, and Hotel Owner roles
 * Verifies Frontend -> Backend -> Database integration
 */

const BASE_URL = 'http://localhost:8080/api';

// Test credentials
const TEST_USERS = {
  customer: { email: 'user@stays.in', password: 'password123' },
  admin: { email: 'admin@stays.in', password: 'admin123' },
  owner: { email: 'owner@stays.in', password: 'owner123' }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results storage
const testResults = {
  customer: { passed: 0, failed: 0, tests: [] },
  admin: { passed: 0, failed: 0, tests: [] },
  owner: { passed: 0, failed: 0, tests: [] }
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Log test result
function logTest(role, testName, passed, details = '') {
  const symbol = passed ? '✓' : '✗';
  const color = passed ? colors.green : colors.red;
  console.log(`${color}${symbol} ${testName}${colors.reset}${details ? ': ' + details : ''}`);
  
  testResults[role].tests.push({ name: testName, passed, details });
  if (passed) testResults[role].passed++;
  else testResults[role].failed++;
}

// Section header
function logSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);
}

// ============================================
// CUSTOMER ROLE TESTS
// ============================================
async function testCustomerRole() {
  logSection('TESTING CUSTOMER ROLE');
  
  let token = null;
  let userId = null;
  let hotelId = null;
  let roomTypeId = null;
  let bookingId = null;

  // 1. Login Test
  console.log(`${colors.blue}1. Authentication Tests${colors.reset}`);
  const loginResult = await apiCall('/users/signin', 'POST', TEST_USERS.customer);
  if (loginResult.success && loginResult.data.jwt) {
    token = loginResult.data.jwt;
    userId = loginResult.data.userId;
    logTest('customer', 'Login', true, `Token received, User ID: ${userId}`);
  } else {
    logTest('customer', 'Login', false, loginResult.error || 'No token received');
    return; // Can't continue without login
  }

  // 2. Get Profile
  const profileResult = await apiCall('/users/profile', 'GET', null, token);
  logTest('customer', 'Get Profile', profileResult.success, 
    profileResult.success ? `Name: ${profileResult.data.firstName} ${profileResult.data.lastName}` : profileResult.error);

  // 3. Browse Hotels
  console.log(`\n${colors.blue}2. Hotel Browsing Tests${colors.reset}`);
  const hotelsResult = await apiCall('/hotels', 'GET');
  if (hotelsResult.success && hotelsResult.data.length > 0) {
    hotelId = hotelsResult.data[0].id;
    logTest('customer', 'Browse Hotels', true, `Found ${hotelsResult.data.length} hotels`);
  } else {
    logTest('customer', 'Browse Hotels', false, 'No hotels found');
  }

  // 4. Get Hotel Details
  if (hotelId) {
    const hotelDetailsResult = await apiCall(`/hotels/${hotelId}`, 'GET');
    logTest('customer', 'Get Hotel Details', hotelDetailsResult.success,
      hotelDetailsResult.success ? `Hotel: ${hotelDetailsResult.data.name}` : hotelDetailsResult.error);
  }

  // 5. Get Hotel Rooms
  if (hotelId) {
    const roomsResult = await apiCall(`/hotels/${hotelId}/rooms`, 'GET');
    if (roomsResult.success && roomsResult.data.length > 0) {
      roomTypeId = roomsResult.data[0].id;
      logTest('customer', 'Get Hotel Rooms', true, `Found ${roomsResult.data.length} room types`);
    } else {
      logTest('customer', 'Get Hotel Rooms', false, 'No rooms found');
    }
  }

  // 6. Search Hotels
  const searchResult = await apiCall('/hotels/search?city=Mumbai', 'GET');
  logTest('customer', 'Search Hotels', searchResult.success,
    searchResult.success ? `Found ${searchResult.data?.length || 0} results` : searchResult.error);

  // 7. Check Availability
  console.log(`\n${colors.blue}3. Booking Tests${colors.reset}`);
  if (hotelId && roomTypeId) {
    const checkIn = '2026-03-01';
    const checkOut = '2026-03-05';
    const availResult = await apiCall(
      `/availability/hotel/${hotelId}/room-type/${roomTypeId}?checkIn=${checkIn}&checkOut=${checkOut}&rooms=1`,
      'GET'
    );
    logTest('customer', 'Check Availability', availResult.success,
      availResult.success ? `Available: ${availResult.data.available}` : availResult.error);
  }

  // 8. Create Booking
  if (hotelId && roomTypeId && token) {
    const bookingData = {
      hotelId: hotelId,
      roomTypeId: roomTypeId,
      checkInDate: '2026-03-01',
      checkOutDate: '2026-03-05',
      adults: 2,
      children: 0,
      rooms: 1
    };
    const createBookingResult = await apiCall('/bookings', 'POST', bookingData, token);
    if (createBookingResult.success) {
      bookingId = createBookingResult.data.id;
      logTest('customer', 'Create Booking', true, `Booking ID: ${bookingId}`);
    } else {
      logTest('customer', 'Create Booking', false, createBookingResult.error);
    }
  }

  // 9. Get My Bookings
  const myBookingsResult = await apiCall('/bookings/my-bookings', 'GET', null, token);
  logTest('customer', 'Get My Bookings', myBookingsResult.success,
    myBookingsResult.success ? `Found ${myBookingsResult.data.length} bookings` : myBookingsResult.error);

  // 10. Recently Viewed
  console.log(`\n${colors.blue}4. Recently Viewed Tests${colors.reset}`);
  if (hotelId && token) {
    const addRecentResult = await apiCall(`/recently-viewed/hotel/${hotelId}`, 'POST', null, token);
    logTest('customer', 'Add to Recently Viewed', addRecentResult.success);
  }

  const getRecentResult = await apiCall('/recently-viewed', 'GET', null, token);
  logTest('customer', 'Get Recently Viewed', getRecentResult.success,
    getRecentResult.success ? `Found ${getRecentResult.data?.length || 0} hotels` : getRecentResult.error);

  // 11. Reviews
  console.log(`\n${colors.blue}5. Review Tests${colors.reset}`);
  if (hotelId && token) {
    const reviewData = {
      hotelId: hotelId,
      rating: 5,
      title: 'Excellent Stay',
      comment: 'Excellent hotel! Great service and amenities.'
    };
    const createReviewResult = await apiCall('/reviews', 'POST', reviewData, token);
    logTest('customer', 'Create Review', createReviewResult.success);
  }

  if (hotelId) {
    const hotelReviewsResult = await apiCall(`/reviews/hotel/${hotelId}`, 'GET');
    logTest('customer', 'Get Hotel Reviews', hotelReviewsResult.success,
      hotelReviewsResult.success ? `Found ${hotelReviewsResult.data?.length || 0} reviews` : hotelReviewsResult.error);
  }

  // 12. Complaints
  console.log(`\n${colors.blue}6. Complaint Tests${colors.reset}`);
  if (token && hotelId) {
    const complaintData = {
      hotelId: hotelId,
      subject: 'Test Complaint',
      description: 'This is a test complaint for system verification'
    };
    const createComplaintResult = await apiCall('/complaints', 'POST', complaintData, token);
    logTest('customer', 'Create Complaint', createComplaintResult.success);
  }

  const myComplaintsResult = await apiCall('/complaints/my-complaints', 'GET', null, token);
  logTest('customer', 'Get My Complaints', myComplaintsResult.success,
    myComplaintsResult.success ? `Found ${myComplaintsResult.data?.length || 0} complaints` : myComplaintsResult.error);

  // 13. Cancel Booking (if created)
  if (bookingId && token) {
    const cancelResult = await apiCall(`/bookings/${bookingId}`, 'DELETE', null, token);
    logTest('customer', 'Cancel Booking', cancelResult.success);
  }
}

// ============================================
// ADMIN ROLE TESTS
// ============================================
async function testAdminRole() {
  logSection('TESTING ADMIN ROLE');
  
  let token = null;
  let userId = null;

  // 1. Login Test
  console.log(`${colors.blue}1. Authentication Tests${colors.reset}`);
  const loginResult = await apiCall('/users/signin', 'POST', TEST_USERS.admin);
  if (loginResult.success && loginResult.data.jwt) {
    token = loginResult.data.jwt;
    userId = loginResult.data.userId;
    logTest('admin', 'Login', true, `Token received, User ID: ${userId}`);
  } else {
    logTest('admin', 'Login', false, loginResult.error || 'No token received');
    return;
  }

  // 2. Get All Users
  console.log(`\n${colors.blue}2. User Management Tests${colors.reset}`);
  const usersResult = await apiCall('/admin/users', 'GET', null, token);
  logTest('admin', 'Get All Users', usersResult.success,
    usersResult.success ? `Found ${usersResult.data?.length || 0} users` : usersResult.error);

  // 3. Get All Bookings
  console.log(`\n${colors.blue}3. Booking Management Tests${colors.reset}`);
  const bookingsResult = await apiCall('/admin/bookings', 'GET', null, token);
  logTest('admin', 'Get All Bookings', bookingsResult.success,
    bookingsResult.success ? `Found ${bookingsResult.data?.length || 0} bookings` : bookingsResult.error);

  // 4. Get All Hotels
  console.log(`\n${colors.blue}4. Hotel Management Tests${colors.reset}`);
  const hotelsResult = await apiCall('/admin/hotels', 'GET', null, token);
  logTest('admin', 'Get All Hotels', hotelsResult.success,
    hotelsResult.success ? `Found ${hotelsResult.data?.length || 0} hotels` : hotelsResult.error);

  // 5. Get Pending Approvals
  const pendingResult = await apiCall('/admin/hotels/pending', 'GET', null, token);
  logTest('admin', 'Get Pending Approvals', pendingResult.success,
    pendingResult.success ? `Found ${pendingResult.data?.length || 0} pending` : pendingResult.error);

  // 6. Get All Reviews
  console.log(`\n${colors.blue}5. Review Management Tests${colors.reset}`);
  const reviewsResult = await apiCall('/admin/reviews', 'GET', null, token);
  logTest('admin', 'Get All Reviews', reviewsResult.success,
    reviewsResult.success ? `Found ${reviewsResult.data?.length || 0} reviews` : reviewsResult.error);

  // 7. Get All Complaints
  console.log(`\n${colors.blue}6. Complaint Management Tests${colors.reset}`);
  const complaintsResult = await apiCall('/admin/complaints', 'GET', null, token);
  logTest('admin', 'Get All Complaints', complaintsResult.success,
    complaintsResult.success ? `Found ${complaintsResult.data?.length || 0} complaints` : complaintsResult.error);

  // 8. Get Analytics
  console.log(`\n${colors.blue}7. Analytics Tests${colors.reset}`);
  const analyticsResult = await apiCall('/admin/analytics', 'GET', null, token);
  logTest('admin', 'Get Analytics', analyticsResult.success,
    analyticsResult.success ? 'Analytics data retrieved' : analyticsResult.error);

  // 9. Get Locations
  console.log(`\n${colors.blue}8. Location Management Tests${colors.reset}`);
  const locationsResult = await apiCall('/admin/locations', 'GET', null, token);
  logTest('admin', 'Get Locations', locationsResult.success,
    locationsResult.success ? `Found ${locationsResult.data?.length || 0} locations` : locationsResult.error);
}

// ============================================
// HOTEL OWNER ROLE TESTS
// ============================================
async function testOwnerRole() {
  logSection('TESTING HOTEL OWNER ROLE');
  
  let token = null;
  let userId = null;
  let hotelId = null;
  let roomTypeId = null;

  // 1. Login Test
  console.log(`${colors.blue}1. Authentication Tests${colors.reset}`);
  const loginResult = await apiCall('/users/signin', 'POST', TEST_USERS.owner);
  if (loginResult.success && loginResult.data.jwt) {
    token = loginResult.data.jwt;
    userId = loginResult.data.userId;
    logTest('owner', 'Login', true, `Token received, User ID: ${userId}`);
  } else {
    logTest('owner', 'Login', false, loginResult.error || 'No token received');
    return;
  }

  // 2. Get My Hotels
  console.log(`\n${colors.blue}2. Hotel Management Tests${colors.reset}`);
  const myHotelsResult = await apiCall('/owner/hotels', 'GET', null, token);
  if (myHotelsResult.success && myHotelsResult.data?.length > 0) {
    hotelId = myHotelsResult.data[0].id;
    logTest('owner', 'Get My Hotels', true, `Found ${myHotelsResult.data.length} hotels`);
  } else {
    logTest('owner', 'Get My Hotels', myHotelsResult.success, 
      myHotelsResult.success ? 'No hotels owned' : myHotelsResult.error);
  }

  // 3. Get Hotel Details
  if (hotelId) {
    const hotelDetailsResult = await apiCall(`/owner/hotels/${hotelId}`, 'GET', null, token);
    logTest('owner', 'Get Hotel Details', hotelDetailsResult.success,
      hotelDetailsResult.success ? `Hotel: ${hotelDetailsResult.data.name}` : hotelDetailsResult.error);
  }

  // 4. Get Hotel Rooms
  console.log(`\n${colors.blue}3. Room Management Tests${colors.reset}`);
  if (hotelId) {
    const roomsResult = await apiCall(`/owner/hotels/${hotelId}/rooms`, 'GET', null, token);
    if (roomsResult.success && roomsResult.data?.length > 0) {
      roomTypeId = roomsResult.data[0].id;
      logTest('owner', 'Get Hotel Rooms', true, `Found ${roomsResult.data.length} room types`);
    } else {
      logTest('owner', 'Get Hotel Rooms', roomsResult.success,
        roomsResult.success ? 'No rooms found' : roomsResult.error);
    }
  }

  // 5. Get Hotel Bookings
  console.log(`\n${colors.blue}4. Booking Management Tests${colors.reset}`);
  if (hotelId) {
    const bookingsResult = await apiCall(`/owner/hotels/${hotelId}/bookings`, 'GET', null, token);
    logTest('owner', 'Get Hotel Bookings', bookingsResult.success,
      bookingsResult.success ? `Found ${bookingsResult.data?.length || 0} bookings` : bookingsResult.error);
  }

  // 6. Get Hotel Reviews
  console.log(`\n${colors.blue}5. Review Management Tests${colors.reset}`);
  if (hotelId) {
    const reviewsResult = await apiCall(`/reviews/hotel/${hotelId}`, 'GET');
    logTest('owner', 'Get Hotel Reviews', reviewsResult.success,
      reviewsResult.success ? `Found ${reviewsResult.data?.length || 0} reviews` : reviewsResult.error);
  }

  // 7. Get Room Statistics
  if (hotelId) {
    const statsResult = await apiCall(`/owner/hotels/${hotelId}/stats`, 'GET', null, token);
    logTest('owner', 'Get Room Statistics', statsResult.success,
      statsResult.success ? 'Statistics retrieved' : statsResult.error);
  }

  // 8. Update Availability
  console.log(`\n${colors.blue}6. Availability Management Tests${colors.reset}`);
  if (hotelId && roomTypeId) {
    const availData = {
      roomTypeId: roomTypeId,
      date: '2026-03-15',
      availableRooms: 5,
      price: 2500.00
    };
    const updateAvailResult = await apiCall(`/owner/hotels/${hotelId}/availability`, 'POST', availData, token);
    logTest('owner', 'Update Availability', updateAvailResult.success);
  }
}

// ============================================
// MAIN TEST EXECUTION
// ============================================
async function runAllTests() {
  console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║     COMPREHENSIVE HOTEL BOOKING SYSTEM TEST SUITE          ║
║     Testing Frontend-Backend-Database Integration          ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  console.log(`${colors.yellow}Starting tests at: ${new Date().toLocaleString()}${colors.reset}\n`);

  // Run tests for each role
  await testCustomerRole();
  await testAdminRole();
  await testOwnerRole();

  // Print summary
  logSection('TEST SUMMARY');
  
  console.log(`${colors.blue}Customer Role:${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed: ${testResults.customer.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${testResults.customer.failed}${colors.reset}`);
  console.log(`  Total: ${testResults.customer.passed + testResults.customer.failed}`);
  
  console.log(`\n${colors.blue}Admin Role:${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed: ${testResults.admin.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${testResults.admin.failed}${colors.reset}`);
  console.log(`  Total: ${testResults.admin.passed + testResults.admin.failed}`);
  
  console.log(`\n${colors.blue}Hotel Owner Role:${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed: ${testResults.owner.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${testResults.owner.failed}${colors.reset}`);
  console.log(`  Total: ${testResults.owner.passed + testResults.owner.failed}`);
  
  const totalPassed = testResults.customer.passed + testResults.admin.passed + testResults.owner.passed;
  const totalFailed = testResults.customer.failed + testResults.admin.failed + testResults.owner.failed;
  const totalTests = totalPassed + totalFailed;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(2);
  
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.yellow}OVERALL RESULTS:${colors.reset}`);
  console.log(`  ${colors.green}✓ Total Passed: ${totalPassed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Total Failed: ${totalFailed}${colors.reset}`);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Success Rate: ${successRate}%`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.yellow}Test completed at: ${new Date().toLocaleString()}${colors.reset}\n`);
}

// Run the tests
runAllTests().catch(console.error);
