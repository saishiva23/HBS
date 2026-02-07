const BASE_URL = 'http://localhost:8080/api';

async function checkData() {
  // Get all hotels
  const response = await fetch(`${BASE_URL}/hotels`);
  const hotels = await response.json();
  
  console.log('Hotels in database:');
  hotels.forEach(h => {
    console.log(`  ID: ${h.id}, Name: ${h.name}, City: ${h.city}, Status: ${h.status}`);
  });
  
  if (hotels.length > 0) {
    const hotelId = hotels[0].id;
    console.log(`\nChecking rooms for hotel ${hotelId}:`);
    const roomsResponse = await fetch(`${BASE_URL}/hotels/${hotelId}/rooms`);
    const rooms = await roomsResponse.json();
    rooms.forEach(r => {
      console.log(`  Room Type ID: ${r.id}, Name: ${r.name}, Price: ${r.pricePerNight}`);
    });
  }
}

checkData();
