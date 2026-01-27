import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import RegisterPage from './pages/RegisterPage';
import Favorites from './pages/Favorites';
import RecentlyViewed from './pages/RecentlyViewed';
import Bookings from './pages/Bookings';
import Help from './pages/Help';
import Hoteliers from './pages/Hoteliers';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';

// Owner Pages (Hotel Owners)
import HotelierDashboard from './pages/admin/HotelierDashboard';
import HotelProfileManagement from './pages/admin/HotelProfileManagement';
import RoomManagement from './pages/admin/RoomManagement';
import BookingManagement from './pages/admin/BookingManagement';
import CustomerExperience from './pages/admin/CustomerExperience';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import HotelierSettings from './pages/admin/HotelierSettings';
import RoomTypeManagement from './pages/admin/RoomTypeManagement';
import HotelOwnerCRUD from './pages/admin/HotelOwnerCRUD';

// Admin Pages (Site Admins)
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import HotelApprovals from './pages/admin/HotelApprovals';
import CustomerManagement from './pages/admin/CustomerManagement';
import SystemAnalytics from './pages/admin/SystemAnalytics';
import LocationManagement from './pages/admin/LocationManagement';
import AdminLogs from './pages/admin/AdminLogs';

// Context Providers
import { HotelProvider } from './context/HotelContext';
import { ReviewsProvider } from './context/ReviewsContext';

function App() {
  return (
    <HotelProvider>
        <ReviewsProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* User Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/recent" element={<RecentlyViewed />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/hoteliers" element={<Hoteliers />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Owner Pages (Hotel Owners) */}
                <Route path="/owner/dashboard" element={<HotelierDashboard />} />
                <Route path="/owner/hotel-profile" element={<HotelProfileManagement />} />
                <Route path="/owner/rooms" element={<RoomManagement />} />
                <Route path="/owner/bookings" element={<BookingManagement />} />
                <Route path="/owner/experience" element={<CustomerExperience />} />
                <Route path="/owner/payments" element={<PaymentsManagement />} />
                <Route path="/owner/settings" element={<HotelierSettings />} />
                <Route path="/owner/my-hotels" element={<HotelOwnerCRUD />} />
                <Route path="/owner/room-types" element={<RoomTypeManagement />} />

                {/* Admin Pages (Site Admins) */}
                <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/admin/approvals" element={<HotelApprovals />} />
                <Route path="/admin/customers" element={<CustomerManagement />} />
                <Route path="/admin/hotels" element={<HotelApprovals />} />
                <Route path="/admin/locations" element={<LocationManagement />} />
                <Route path="/admin/locations" element={<LocationManagement />} />
                <Route path="/admin/analytics" element={<SystemAnalytics />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ReviewsProvider>
    </HotelProvider>
  );
}

export default App;
