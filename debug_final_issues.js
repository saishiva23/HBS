const BASE_URL = 'http://localhost:8080/api';

async function debugFinalIssues() {
  console.log('🔍 Debugging Final 2 Issues\n');
  
  // Login as customer
  const loginRes = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@stays.in', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const customerToken = loginData.jwt;
  
  // Login as admin
  const adminLoginRes = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@stays.in', password: 'admin123' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.jwt;
  
  // Get hotel ID
  const hotelsRes = await fetch(`${BASE_URL}/hotels`);
  const hotels = await hotelsRes.json();
  const hotelId = hotels[0].id;
  
  console.log('='.repeat(60));
  console.log('ISSUE 1: Add to Recently Viewed');
  console.log('='.repeat(60));
  
  const recentRes = await fetch(`${BASE_URL}/recently-viewed/hotel/${hotelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`
    }
  });
  
  console.log(`Status: ${recentRes.status}`);
  const recentText = await recentRes.text();
  console.log(`Response: ${recentText}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('ISSUE 2: Admin Get All Complaints');
  console.log('='.repeat(60));
  
  const complaintsRes = await fetch(`${BASE_URL}/admin/complaints`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  console.log(`Status: ${complaintsRes.status}`);
  const complaintsText = await complaintsRes.text();
  console.log(`Response: ${complaintsText}`);
}

debugFinalIssues();
