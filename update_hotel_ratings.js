/**
 * Update Hotel Ratings Based on Reviews
 * Calculates average rating and updates hotel records
 */

const BASE_URL = 'http://localhost:8080/api';

async function updateHotelRatings() {
  console.log('🔄 Updating Hotel Ratings from Reviews\n');
  console.log('='.repeat(60));
  
  // Login as admin to update hotels
  const loginRes = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@stays.in', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const adminToken = loginData.jwt;
  
  // Get all hotels
  const hotelsRes = await fetch(`${BASE_URL}/hotels`);
  const hotels = await hotelsRes.json();
  
  console.log(`\nFound ${hotels.length} hotels\n`);
  
  for (const hotel of hotels) {
    console.log(`\n📍 Processing: ${hotel.name} (ID: ${hotel.id})`);
    
    // Get reviews for this hotel
    const reviewsRes = await fetch(`${BASE_URL}/reviews/hotel/${hotel.id}`);
    const reviews = await reviewsRes.json();
    
    console.log(`  Reviews found: ${reviews.length}`);
    
    if (reviews.length > 0) {
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = (totalRating / reviews.length).toFixed(1);
      
      // Determine rating text
      let ratingText = 'Good';
      if (avgRating >= 4.5) ratingText = 'Excellent';
      else if (avgRating >= 4.0) ratingText = 'Very Good';
      else if (avgRating >= 3.5) ratingText = 'Good';
      else if (avgRating >= 3.0) ratingText = 'Average';
      else ratingText = 'Below Average';
      
      console.log(`  Calculated Rating: ${avgRating}/5.0 (${ratingText})`);
      console.log(`  Rating Count: ${reviews.length}`);
      
      // Update hotel via SQL (since we don't have a direct update endpoint)
      console.log(`  ✅ Hotel needs update: rating=${avgRating}, ratingText=${ratingText}, ratingCount=${reviews.length}`);
      
    } else {
      console.log(`  ⚠️  No reviews - keeping default rating`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 To apply these updates, run this SQL:');
  console.log('='.repeat(60));
  
  // Generate SQL update statements
  for (const hotel of hotels) {
    const reviewsRes = await fetch(`${BASE_URL}/reviews/hotel/${hotel.id}`);
    const reviews = await reviewsRes.json();
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = (totalRating / reviews.length).toFixed(1);
      
      let ratingText = 'Good';
      if (avgRating >= 4.5) ratingText = 'Excellent';
      else if (avgRating >= 4.0) ratingText = 'Very Good';
      else if (avgRating >= 3.5) ratingText = 'Good';
      else if (avgRating >= 3.0) ratingText = 'Average';
      else ratingText = 'Below Average';
      
      console.log(`\nUPDATE hotels SET rating = ${avgRating}, rating_text = '${ratingText}', rating_count = ${reviews.length} WHERE id = ${hotel.id};`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

updateHotelRatings().catch(console.error);
