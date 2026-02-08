// Customer API Service - Frontend Integration
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a login attempt failure
      const isLoginRequest = error.config?.url?.includes('/signin') || error.config?.url?.includes('/login');

      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    throw error.response?.data || error;
  }
);

// ============ CUSTOMER APIs ============

// 1. AUTHENTICATION
export const auth = {
  // Login
  login: (email, password) =>
    api.post('/users/signin', { email, password }),

  // Register
  register: (userData) =>
    api.post('/users/signup', userData),

  // Get current user profile
  getProfile: () =>
    api.get('/users/profile'),

  // Update current user profile
  updateProfile: (userData) =>
    api.put('/users/profile', userData),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.patch('/users/change-password', null, {
      params: { currentPassword, newPassword }
    }),
};

// 2. HOTEL SEARCH & BROWSE
export const hotels = {
  // Get all hotels (Home page)
  getAll: () =>
    api.get('/hotels'),

  // Search hotels by city/destination
  search: (city, destination) =>
    api.get('/hotels/search', { params: { city, destination } }),

  // Get hotel details
  getById: (hotelId) =>
    api.get(`/hotels/${hotelId}`),

  // Get hotel rooms
  getRooms: (hotelId) =>
    api.get(`/hotels/${hotelId}/rooms`),
};

// 3. BOOKING MANAGEMENT
export const bookings = {
  // Create booking (Checkout)
  create: (bookingData) =>
    api.post('/bookings', bookingData),

  // Get user bookings (My Bookings page)
  getMy: () =>
    api.get('/bookings/my-bookings'),

  // Update booking
  update: (bookingId, data) =>
    api.put(`/bookings/${bookingId}`, data),

  // Cancel booking
  cancel: (bookingId) =>
    api.delete(`/bookings/${bookingId}`),
};

// 4. INVOICE SERVICE (.NET)
export const invoice = {
  // Generate PDF invoice
  generate: (invoiceData) =>
    axios.post('http://localhost:5000/api/invoice/generate', invoiceData, {
      responseType: 'blob',
    }),
};

// 5. REVIEWS
export const reviews = {
  // Create review
  create: (reviewData) =>
    api.post('/reviews', reviewData),

  // Get hotel reviews
  getHotelReviews: (hotelId) =>
    api.get(`/reviews/hotel/${hotelId}`),

  // Get user reviews
  getMyReviews: () =>
    api.get('/reviews/my-reviews'),
};

// 6. COMPLAINTS
export const complaints = {
  // Create complaint
  create: (complaintData) =>
    api.post('/complaints', complaintData),

  // Get my complaints
  getMy: () =>
    api.get('/complaints/my-complaints'),
};

// 7. RECENTLY VIEWED
export const recentlyViewed = {
  // Add hotel to recently viewed
  add: (hotelId) =>
    api.post(`/recently-viewed/hotel/${hotelId}`),

  // Get recently viewed hotels
  get: () =>
    api.get('/recently-viewed'),
};

// 8. AVAILABILITY
export const availability = {
  // Check room availability for specific dates
  checkRoomAvailability: (hotelId, roomTypeId, checkIn, checkOut, rooms = 1) =>
    api.get(`/availability/hotel/${hotelId}/room-type/${roomTypeId}`, {
      params: { checkIn, checkOut, rooms }
    }),

  // Check availability for multiple dates (for calendar visualization)
  checkBatchAvailability: (hotelId, roomTypeId, startDate, endDate, rooms = 1) =>
    api.get(`/availability/hotel/${hotelId}/room-type/${roomTypeId}/batch`, {
      params: { startDate, endDate, rooms }
    }),

  // Check detailed availability with room counts for calendar
  checkBatchDetailedAvailability: (hotelId, roomTypeId, startDate, endDate, rooms = 1) =>
    api.get(`/availability/hotel/${hotelId}/room-type/${roomTypeId}/batch-detailed`, {
      params: { startDate, endDate, rooms }
    }),
};

// ============ FRONTEND PAGE INTEGRATIONS ============

// HOME PAGE APIs
export const homePage = {
  // Load hotels for display
  loadHotels: () => hotels.getAll(),

  // Search hotels from search bar
  searchHotels: (searchParams) => hotels.search(searchParams.city, searchParams.destination),
};

// SEARCH RESULTS PAGE APIs
export const searchPage = {
  // Search with filters
  searchWithFilters: (filters) =>
    hotels.search(filters.city, filters.destination),

  // Get hotel details for modal/popup
  getHotelDetails: (hotelId) => hotels.getById(hotelId),

  // Get rooms for booking
  getHotelRooms: (hotelId) => hotels.getRooms(hotelId),
};

// HOTEL DETAILS PAGE APIs
export const hotelDetailsPage = {
  // Load hotel info
  loadHotel: (hotelId) => hotels.getById(hotelId),

  // Load available rooms
  loadRooms: (hotelId) => hotels.getRooms(hotelId),
};

// CART PAGE APIs
export const cartPage = {
  // Create bookings from cart items
  checkout: async (cartItems) => {
    // Filter and validate cart items
    const validItems = cartItems.filter(item =>
      item.checkIn &&
      item.checkOut &&
      item.checkIn !== 'Not selected' &&
      item.checkOut !== 'Not selected' &&
      item.checkIn !== '' &&
      item.checkOut !== ''
    );

    if (validItems.length === 0) {
      throw new Error('Please select valid check-in and check-out dates for all items');
    }

    const bookingPromises = validItems.map(item => {
      if (!item.hotelId || !item.roomTypeId) {
        throw new Error(`Invalid cart item: Missing hotel or room type ID for ${item.hotel}`);
      }
      return bookings.create({
        hotelId: item.hotelId,
        roomTypeId: item.roomTypeId,
        checkInDate: item.checkIn,
        checkOutDate: item.checkOut,
        adults: item.guests || 2,
        children: 0,
        rooms: item.rooms || 1,
      });
    });
    return Promise.all(bookingPromises);
  },
};

// BOOKINGS PAGE APIs
export const bookingsPage = {
  // Load user bookings
  loadBookings: () => bookings.getMy(),

  // Cancel booking
  cancelBooking: (bookingId) => bookings.cancel(bookingId),

  // Update booking
  updateBooking: (bookingId, data) => bookings.update(bookingId, data),

  // Download invoice
  downloadInvoice: (bookingData) => invoice.generate(bookingData),
};

// LOGIN/REGISTER PAGE APIs
export const authPage = {
  // User login
  login: (email, password) => auth.login(email, password),

  // User registration
  register: (userData) => auth.register(userData),
};

// ============ USAGE EXAMPLES ============

// Home Page
// const hotels = await homePage.loadHotels();

// Search
// const results = await searchPage.searchWithFilters({ city: 'Mumbai' });

// Hotel Details
// const hotel = await hotelDetailsPage.loadHotel(1);
// const rooms = await hotelDetailsPage.loadRooms(1);

// Checkout
// await cartPage.checkout(cartItems);

// Bookings
// const myBookings = await bookingsPage.loadBookings();
// await bookingsPage.cancelBooking(1);

// Auth
// await authPage.login('user@example.com', 'password');
// await authPage.register({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123' });

export default {
  auth,
  hotels,
  bookings,
  invoice,
  reviews,
  complaints,
  recentlyViewed,
  availability,
  homePage,
  searchPage,
  hotelDetailsPage,
  cartPage,
  bookingsPage,
  authPage,
};