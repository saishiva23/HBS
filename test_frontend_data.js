/**
 * Test Frontend Data Display
 * Checks what data is available and displaying on frontend
 */

const BASE_URL = 'http://localhost:8080/api';

async function testFrontendData() {
  console.log('🔍 Testing Frontend Data Display\n');
  console.log('='.repeat(60));
  
  // 1. Get all hotels (what home page would show)
  console.log('\n1️⃣ HOTELS DATA (for home/search pages)');
  console.log('='.repeat(60));
  
  const hotelsRes = await fetch(`${BASE_URL}/hotels`);
  const hotels = await hotelsRes.json();
  
  console.log(`\nTotal Hotels: ${hotels.length}`);
  
  hotels.forEach((hotel, index) => {
    console.log(`\n--- Hotel ${index + 1}: ${hotel.name} ---`);
    console.log(`  ID: ${hotel.id}`);
    console.log(`  City: ${hotel.city}`);
    console.log(`  Status: ${hotel.status}`);
    console.log(`  Rating: ${hotel.rating || 'N/A'}`);
    console.log(`  Rating Text: ${hotel.ratingText || 'N/A'}`);
    console.log(`  Rating Count: ${hotel.ratingCount || 0}`);
    console.log(`  Price Range: ${hotel.priceRange || 'N/A'}`);
    console.log(`  Images: ${hotel.images ? hotel.images.length : 0} images`);
    console.log(`  Amenities: AC=${hotel.ac}, WiFi=${hotel.wifi}, Parking=${hotel.parking}`);
  });
  
  // 2. Get reviews for each hotel
  console.log('\n\n2️⃣ REVIEWS DATA');
  console.log('='.repeat(60));
  
  for (const hotel of hotels) {
    const reviewsRes = await fetch(`${BASE_URL}/reviews/hotel/${hotel.id}`);
    const reviews = await reviewsRes.json();
    
    console.log(`\n${hotel.name} (ID: ${hotel.id}):`);
    console.log(`  Total Reviews: ${reviews.length}`);
    
    if (reviews.length > 0) {
      reviews.forEach((review, idx) => {
        console.log(`  Review ${idx + 1}:`);
        console.log(`    - Title: ${review.title}`);
        console.log(`    - Rating: ${review.rating}/5`);
        console.log(`    - Comment: ${review.comment?.substring(0, 50)}...`);
        console.log(`    - User: ${review.user?.firstName || 'Anonymous'}`);
      });
    } else {
      console.log('  ⚠️  No reviews yet');
    }
  }
  
  // 3. Get rooms for each hotel
  console.log('\n\n3️⃣ ROOMS DATA');
  console.log('='.repeat(60));
  
  for (const hotel of hotels) {
    const roomsRes = await fetch(`${BASE_URL}/hotels/${hotel.id}/rooms`);
    const rooms = await roomsRes.json();
    
    console.log(`\n${hotel.name}:`);
    console.log(`  Total Room Types: ${rooms.length}`);
    
    rooms.forEach((room, idx) => {
      console.log(`  Room ${idx + 1}:`);
      console.log(`    - Type: ${room.name}`);
      console.log(`    - Price: ₹${room.pricePerNight}/night`);
      console.log(`    - Capacity: ${room.capacity} guests`);
      console.log(`    - Available: ${room.availableRooms || 'N/A'} rooms`);
    });
  }
  
  // 4. Check destinations/cities data
  console.log('\n\n4️⃣ DESTINATIONS DATA (for Popular Searches)');
  console.log('='.repeat(60));
  
  const citiesSet = new Set();
  const statesSet = new Set();
  
  hotels.forEach(hotel => {
    if (hotel.city) citiesSet.add(hotel.city);
    if (hotel.state) statesSet.add(hotel.state);
  });
  
  console.log(`\nUnique Cities: ${citiesSet.size}`);
  console.log(`Cities: ${Array.from(citiesSet).join(', ')}`);
  
  console.log(`\nUnique States: ${statesSet.size}`);
  console.log(`States: ${Array.from(statesSet).join(', ')}`);
  
  // 5. Summary
  console.log('\n\n5️⃣ SUMMARY');
  console.log('='.repeat(60));
  
  const totalReviews = await Promise.all(
    hotels.map(async h => {
      const res = await fetch(`${BASE_URL}/reviews/hotel/${h.id}`);
      const reviews = await res.json();
      return reviews.length;
    })
  );
  
  const totalReviewCount = totalReviews.reduce((a, b) => a + b, 0);
  
  console.log(`\n✅ Hotels: ${hotels.length}`);
  console.log(`✅ Total Reviews: ${totalReviewCount}`);
  console.log(`✅ Cities: ${citiesSet.size}`);
  console.log(`✅ States: ${statesSet.size}`);
  
  // Check if data is sufficient for display
  console.log('\n📊 DATA COMPLETENESS CHECK:');
  
  const hotelsWithRating = hotels.filter(h => h.rating).length;
  const hotelsWithImages = hotels.filter(h => h.images && h.images.length > 0).length;
  const hotelsWithPrice = hotels.filter(h => h.priceRange).length;
  
  console.log(`  Hotels with Rating: ${hotelsWithRating}/${hotels.length}`);
  console.log(`  Hotels with Images: ${hotelsWithImages}/${hotels.length}`);
  console.log(`  Hotels with Price: ${hotelsWithPrice}/${hotels.length}`);
  console.log(`  Hotels with Reviews: ${totalReviews.filter(c => c > 0).length}/${hotels.length}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (totalReviewCount === 0) {
    console.log('  ⚠️  No reviews in system - reviews won\'t display on frontend');
  } else {
    console.log(`  ✅ ${totalReviewCount} reviews available for display`);
  }
  
  if (hotelsWithRating < hotels.length) {
    console.log(`  ⚠️  ${hotels.length - hotelsWithRating} hotels missing ratings`);
  }
  
  if (hotelsWithImages < hotels.length) {
    console.log(`  ⚠️  ${hotels.length - hotelsWithImages} hotels missing images`);
  }
  
  if (citiesSet.size < 3) {
    console.log('  ⚠️  Limited cities - Popular Searches may look empty');
  }
  
  console.log('\n' + '='.repeat(60));
}

testFrontendData().catch(console.error);
