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
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.warn('Unauthorized access - clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
);

// ============ PUBLIC APIs (No Auth) ============
export const publicAPI = {
  // Hotels
  getHotels: () => api.get('/hotels'),
  getHotel: (id) => api.get(`/hotels/${id}`),
  searchHotels: (city, destination) => api.get('/hotels/search', { params: { city, destination } }),
  getHotelRooms: (hotelId) => api.get(`/hotels/${hotelId}/rooms`),
  getDestinations: (type) => api.get('/hotels/destinations', { params: { type } }),
  checkAvailability: (hotelId, roomTypeId, checkIn, checkOut, rooms) =>
    api.get(`/hotels/${hotelId}/rooms/${roomTypeId}/availability`, {
      params: { checkIn, checkOut, rooms }
    }),
  registerHotelWithUser: (registrationData) => api.post('/hotels/register-public', registrationData),
};

// ============ CUSTOMER APIs (ROLE_CUSTOMER) ============

export const customerAPI = {
  // Auth
  login: (email, password) => api.post('/users/signin', { email, password }),
  register: (userData) => api.post('/users/signup', userData),

  // Profile
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (currentPassword, newPassword) =>
    api.patch('/users/change-password', null, { params: { currentPassword, newPassword } }),

  // Bookings
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  updateBooking: (bookingId, data) => api.put(`/bookings/${bookingId}`, data),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),

  // Reviews
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getHotelReviews: (hotelId) => api.get(`/reviews/hotel/${hotelId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),

  // Recently Viewed
  addRecentlyViewed: (hotelId) => api.post(`/recently-viewed/hotel/${hotelId}`),
  getRecentlyViewed: () => api.get('/recently-viewed'),
};

// ============ HOTEL OWNER APIs (ROLE_HOTEL_MANAGER) ============

export const ownerAPI = {
  // Hotel Management
  getMyHotels: () => api.get('/owner/hotels'),
  getMyHotel: (hotelId) => api.get(`/owner/hotels/${hotelId}`),
  createHotel: (hotelData) => api.post('/owner/hotels', hotelData),
  updateHotel: (hotelId, hotelData) => api.put(`/owner/hotels/${hotelId}`, hotelData),
  deleteHotel: (hotelId) => api.delete(`/owner/hotels/${hotelId}`),

  // Room Type Management
  getHotelRooms: (hotelId) => api.get(`/owner/hotels/${hotelId}/rooms`),
  addRoomType: (hotelId, roomData) => api.post(`/owner/hotels/${hotelId}/rooms`, roomData),
  updateRoomType: (hotelId, roomId, roomData) => api.put(`/owner/hotels/${hotelId}/rooms/${roomId}`, roomData),
  deleteRoomType: (hotelId, roomId) => api.delete(`/owner/hotels/${hotelId}/rooms/${roomId}`),

  // Individual Room List Management
  getHotelRoomsList: (hotelId) => api.get(`/owner/hotels/${hotelId}/room-list`),
  addRoomToList: (hotelId, roomData) => api.post(`/owner/hotels/${hotelId}/room-list`, roomData),
  updateRoomInList: (hotelId, roomId, roomData) => api.put(`/owner/hotels/${hotelId}/room-list/${roomId}`, roomData),
  deleteRoomFromList: (hotelId, roomId) => api.delete(`/owner/hotels/${hotelId}/room-list/${roomId}`),

  // Booking Management
  getMyBookings: () => api.get('/owner/bookings'),
  getHotelBookings: (hotelId) => api.get(`/owner/hotels/${hotelId}/bookings`),
  updateBookingStatus: (bookingId, status) =>
    api.patch(`/owner/bookings/${bookingId}/status`, null, { params: { status } }),

  // Dashboard
  getDashboardStats: () => api.get('/owner/dashboard/stats'),

  // Customer Experience
  getHotelReviews: (hotelId) => api.get(`/owner/hotels/${hotelId}/reviews`),
  getReviewStats: (hotelId) => api.get(`/owner/hotels/${hotelId}/reviews/stats`),
  getHotelComplaints: (hotelId) => api.get(`/owner/hotels/${hotelId}/complaints`),
  resolveComplaint: (complaintId, resolution) =>
    api.put(`/owner/complaints/${complaintId}/resolve`, { resolution }),

  // Payment Management
  getPaymentHistory: (hotelId) => api.get(`/owner/hotels/${hotelId}/payments`),
  getPaymentStats: (hotelId) => api.get(`/owner/hotels/${hotelId}/payments/stats`),
};

// ============ ADMIN APIs (ROLE_ADMIN) ============

export const adminAPI = {
  // Hotel Management
  getAllHotels: () => api.get('/admin/hotels'),
  getPendingHotels: () => api.get('/admin/hotels/pending'),
  getApprovedHotels: () => api.get('/admin/hotels/approved'),
  getRejectedHotels: () => api.get('/admin/hotels/rejected'),
  approveHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/approve`),
  rejectHotel: (hotelId, reason) =>
    api.patch(`/admin/hotels/${hotelId}/reject`, null, { params: { reason } }),
  deleteHotel: (hotelId) => api.delete(`/admin/hotels/${hotelId}`),

  // Payment Management
  getAllPayments: () => api.get('/admin/payments'),
  getPendingPayments: () => api.get('/admin/payments/pending'),
  getCompletedPayments: () => api.get('/admin/payments/completed'),
  getFailedPayments: () => api.get('/admin/payments/failed'),

  // User Management
  getAllUsers: () => api.get('/admin/users'),
  getSuspendedUsers: () => api.get('/admin/users/suspended'),
  suspendUser: (userId, reason) =>
    api.patch(`/admin/users/${userId}/suspend`, null, { params: { reason } }),
  activateUser: (userId) => api.patch(`/admin/users/${userId}/activate`),

  // Platform Bookings
  getAllBookings: () => api.get('/bookings'),

  // Analytics
  getSystemAnalytics: () => api.get('/admin/analytics'),

  // Location Management
  getAllLocations: () => api.get('/admin/locations'),
  addLocation: (locationData) => api.post('/admin/locations', locationData),
  updateLocation: (id, locationData) => api.put(`/admin/locations/${id}`, locationData),
  deleteLocation: (id) => api.delete(`/admin/locations/${id}`),

  // Recent Activity
  getRecentCustomers: () => api.get('/admin/users/recent'),
  getRecentHotels: () => api.get('/admin/hotels/recent'),
};

// ============ COMPLAINT APIs ============

export const complaintAPI = {
  raiseComplaint: (complaintData) => api.post('/complaints', complaintData),
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  getAllComplaints: () => api.get('/complaints'),
  resolveComplaint: (id, status, comment) =>
    api.patch(`/complaints/${id}/resolve`, null, { params: { status, comment } }),
};

// ============ INVOICE SERVICE (.NET) ============

export const invoiceAPI = {
  generateInvoice: (invoiceData) =>
    axios.post('http://localhost:5000/api/invoice/generate', invoiceData, {
      responseType: 'blob',
    }),
};

// ============ FRONTEND PAGE INTEGRATIONS ============

// HOME PAGE
export const homePage = {
  loadHotels: () => publicAPI.getHotels(),
  searchHotels: (city, destination) => publicAPI.searchHotels(city, destination),
};

// SEARCH RESULTS PAGE
export const searchPage = {
  searchWithFilters: (filters) => publicAPI.searchHotels(filters.city, filters.destination),
  getHotelDetails: (hotelId) => publicAPI.getHotel(hotelId),
  getHotelRooms: (hotelId) => publicAPI.getHotelRooms(hotelId),
  checkAvailability: (hotelId, roomTypeId, checkIn, checkOut, rooms) =>
    publicAPI.checkAvailability(hotelId, roomTypeId, checkIn, checkOut, rooms),
};

// HOTEL DETAILS PAGE
export const hotelDetailsPage = {
  loadHotel: (hotelId) => publicAPI.getHotel(hotelId),
  loadRooms: (hotelId) => publicAPI.getHotelRooms(hotelId),
  checkAvailability: (hotelId, roomTypeId, checkIn, checkOut, rooms) =>
    publicAPI.checkAvailability(hotelId, roomTypeId, checkIn, checkOut, rooms),
};

// BOOKINGS PAGE
export const bookingsPage = {
  loadBookings: () => customerAPI.getMyBookings(),
  cancelBooking: (bookingId) => customerAPI.cancelBooking(bookingId),
  updateBooking: (bookingId, data) => customerAPI.updateBooking(bookingId, data),
  downloadInvoice: (bookingData) => invoiceAPI.generateInvoice(bookingData),
};

// AUTH PAGE
export const authPage = {
  login: (email, password) => customerAPI.login(email, password),
  register: (userData) => customerAPI.register(userData),
};

// HOTEL OWNER DASHBOARD
export const ownerDashboard = {
  getStats: () => ownerAPI.getDashboardStats(),
  getMyHotels: () => ownerAPI.getMyHotels(),
  getMyBookings: () => ownerAPI.getMyBookings(),
};

// HOTEL OWNER - HOTEL MANAGEMENT
export const ownerHotelManagement = {
  getMyHotels: () => ownerAPI.getMyHotels(),
  getHotel: (hotelId) => ownerAPI.getMyHotel(hotelId),
  createHotel: (hotelData) => ownerAPI.createHotel(hotelData),
  updateHotel: (hotelId, hotelData) => ownerAPI.updateHotel(hotelId, hotelData),
  deleteHotel: (hotelId) => ownerAPI.deleteHotel(hotelId),
};

// HOTEL OWNER - ROOM MANAGEMENT
export const ownerRoomManagement = {
  getRooms: (hotelId) => ownerAPI.getHotelRooms(hotelId),
  addRoom: (hotelId, roomData) => ownerAPI.addRoomType(hotelId, roomData),
  updateRoom: (hotelId, roomId, roomData) => ownerAPI.updateRoomType(hotelId, roomId, roomData),
  deleteRoom: (hotelId, roomId) => ownerAPI.deleteRoomType(hotelId, roomId),

  // Individual room list management
  getRoomsList: (hotelId) => ownerAPI.getHotelRoomsList(hotelId),
  addRoomToList: (hotelId, roomData) => ownerAPI.addRoomToList(hotelId, roomData),
  updateRoomInList: (hotelId, roomId, roomData) => ownerAPI.updateRoomInList(hotelId, roomId, roomData),
  deleteRoomFromList: (hotelId, roomId) => ownerAPI.deleteRoomFromList(hotelId, roomId),
};

// HOTEL OWNER - BOOKING MANAGEMENT
export const ownerBookingManagement = {
  getAllBookings: () => ownerAPI.getMyBookings(),
  getHotelBookings: (hotelId) => ownerAPI.getHotelBookings(hotelId),
  updateStatus: (bookingId, status) => ownerAPI.updateBookingStatus(bookingId, status),
};

// HOTEL OWNER - CUSTOMER EXPERIENCE
export const ownerCustomerExperience = {
  // Reviews
  getHotelReviews: (hotelId) => ownerAPI.getHotelReviews(hotelId),
  getReviewStats: (hotelId) => ownerAPI.getReviewStats(hotelId),

  // Complaints
  getHotelComplaints: (hotelId) => ownerAPI.getHotelComplaints(hotelId),
  resolveComplaint: (complaintId, resolution) => ownerAPI.resolveComplaint(complaintId, resolution),
};

// HOTEL OWNER - PAYMENT MANAGEMENT
export const ownerPayment = {
  getHistory: (hotelId) => ownerAPI.getPaymentHistory(hotelId),
  getStats: (hotelId) => ownerAPI.getPaymentStats(hotelId),
};

// ADMIN - HOTEL APPROVALS
export const adminHotelApprovals = {
  getPending: () => adminAPI.getPendingHotels(),
  getApproved: () => adminAPI.getApprovedHotels(),
  getRejected: () => adminAPI.getRejectedHotels(),
  approve: (hotelId) => adminAPI.approveHotel(hotelId),
  reject: (hotelId, reason) => adminAPI.rejectHotel(hotelId, reason),
};

// ADMIN - PAYMENT MANAGEMENT
export const adminPaymentManagement = {
  getAll: () => adminAPI.getAllPayments(),
  getPending: () => adminAPI.getPendingPayments(),
  getCompleted: () => adminAPI.getCompletedPayments(),
  getFailed: () => adminAPI.getFailedPayments(),
};

// ADMIN - USER MANAGEMENT
export const adminUserManagement = {
  getAllUsers: () => adminAPI.getAllUsers(),
  getSuspended: () => adminAPI.getSuspendedUsers(),
  suspend: (userId, reason) => adminAPI.suspendUser(userId, reason),
  activate: (userId) => adminAPI.activateUser(userId),
};

// ADMIN - BOOKING MANAGEMENT
export const adminBookingManagement = {
  getAllBookings: () => adminAPI.getAllBookings(),
};

// ADMIN - SYSTEM ANALYTICS
export const adminSystemAnalytics = {
  getStats: () => adminAPI.getSystemAnalytics(),
};

// ADMIN - LOCATION MANAGEMENT
export const adminLocationManagement = {
  getAll: () => adminAPI.getAllLocations(),
  add: (data) => adminAPI.addLocation(data),
  update: (id, data) => adminAPI.updateLocation(id, data),
  delete: (id) => adminAPI.deleteLocation(id),
};

// Default export with all APIs
export default {
  public: publicAPI,
  customer: customerAPI,
  owner: ownerAPI,
  admin: adminAPI,
  invoice: invoiceAPI,

  // Page integrations
  homePage,
  searchPage,
  hotelDetailsPage,
  bookingsPage,
  authPage,
  ownerDashboard,
  ownerHotelManagement,
  ownerRoomManagement,
  ownerBookingManagement,
  adminHotelApprovals,
  adminPaymentManagement,
  adminUserManagement,
  adminBookingManagement,
  adminSystemAnalytics,
  adminLocationManagement,
  complaintAPI,
};