/**
 * Debug script for failing tests
 * Tests each failing endpoint with detailed logging
 */

const BASE_URL = 'http://localhost:8080/api';

const TEST_USERS = {
  customer: { email: 'user@stays.in', password: 'password123' }
};

async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    console.log(`\n🔍 Testing: ${method} ${endpoint}`);
    console.log('Request body:', body ? JSON.stringify(body, null, 2) : 'None');
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await response.text();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    return { success: response.ok, status: response.status, data, text };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function debugTests() {
  console.log('🔧 DEBUGGING FAILING TESTS\n');
  console.log('='.repeat(60));
  
  // Login first
  console.log('\n1️⃣ LOGIN');
  const loginResult = await apiCall('/users/signin', 'POST', TEST_USERS.customer);
  
  if (!loginResult.success || !loginResult.data.jwt) {
    console.error('❌ Cannot proceed without login');
    return;
  }
  
  const token = loginResult.data.jwt;
  console.log('✅ Login successful, token received');
  
  // Test 1: Check Availability
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CHECK AVAILABILITY');
  const hotelId = 1;
  const roomTypeId = 1;
  const checkIn = '2026-03-01';
  const checkOut = '2026-03-05';
  
  const availResult = await apiCall(
    `/availability/hotel/${hotelId}/room-type/${roomTypeId}?checkIn=${checkIn}&checkOut=${checkOut}&rooms=1`,
    'GET'
  );
  
  if (!availResult.success) {
    console.log('❌ Availability check failed');
    console.log('Possible issues:');
    console.log('- Invalid hotel or room type ID');
    console.log('- Date format issue');
    console.log('- Missing room occupancy data');
  }
  
  // Test 2: Add to Recently Viewed
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ ADD TO RECENTLY VIEWED');
  const recentResult = await apiCall(
    `/recently-viewed/hotel/${hotelId}`,
    'POST',
    null,
    token
  );
  
  if (!recentResult.success) {
    console.log('❌ Add to recently viewed failed');
    console.log('Possible issues:');
    console.log('- Authentication issue');
    console.log('- Invalid hotel ID');
    console.log('- Database constraint');
  }
  
  // Test 3: Create Review
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ CREATE REVIEW');
  const reviewData = {
    hotelId: hotelId,
    rating: 5,
    comment: 'Excellent hotel! Great service and amenities.'
  };
  
  const reviewResult = await apiCall('/reviews', 'POST', reviewData, token);
  
  if (!reviewResult.success) {
    console.log('❌ Create review failed');
    console.log('Possible issues:');
    console.log('- Missing required fields');
    console.log('- Invalid rating value');
    console.log('- User already reviewed this hotel');
    console.log('- Hotel not found');
  }
  
  // Test 4: Get Hotel Reviews
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣ GET HOTEL REVIEWS');
  const getReviewsResult = await apiCall(`/reviews/hotel/${hotelId}`, 'GET');
  
  if (!getReviewsResult.success) {
    console.log('❌ Get hotel reviews failed');
    console.log('Possible issues:');
    console.log('- Invalid hotel ID');
    console.log('- Database query error');
  } else {
    console.log(`✅ Found ${getReviewsResult.data?.length || 0} reviews`);
  }
  
  // Test 5: Create Complaint
  console.log('\n' + '='.repeat(60));
  console.log('6️⃣ CREATE COMPLAINT');
  const complaintData = {
    subject: 'Test Complaint',
    description: 'This is a test complaint for system verification',
    category: 'SERVICE',
    hotelId: hotelId
  };
  
  const complaintResult = await apiCall('/complaints', 'POST', complaintData, token);
  
  if (!complaintResult.success) {
    console.log('❌ Create complaint failed');
    console.log('Possible issues:');
    console.log('- Missing required fields');
    console.log('- Invalid category value');
    console.log('- Hotel not found');
    console.log('- Booking reference required?');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 DEBUG COMPLETE');
}

debugTests().catch(console.error);
