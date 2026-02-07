const BASE_URL = 'http://localhost:8080/api';

async function testAccessControl() {
  // Login as customer
  const customerLogin = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@stays.in', password: 'password123' })
  });
  const customerData = await customerLogin.json();
  const customerToken = customerData.jwt;
  
  console.log('Testing customer access to admin endpoint...\n');
  
  // Try to access admin endpoint
  const adminAccess = await fetch(`${BASE_URL}/admin/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`
    }
  });
  
  console.log(`Status: ${adminAccess.status}`);
  console.log(`Status Text: ${adminAccess.statusText}`);
  
  if (adminAccess.status === 403) {
    console.log('✓ Access Control WORKING - Customer blocked from admin endpoint');
  } else if (adminAccess.status === 200) {
    const data = await adminAccess.json();
    console.log('✗ Access Control BROKEN - Customer can access admin endpoint');
    console.log(`Data returned: ${JSON.stringify(data).substring(0, 100)}...`);
  } else {
    console.log(`? Unexpected status: ${adminAccess.status}`);
  }
}

testAccessControl();
