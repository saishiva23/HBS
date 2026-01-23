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

// Admin Pages
import HotelierDashboard from './pages/admin/HotelierDashboard';
import HotelProfileManagement from './pages/admin/HotelProfileManagement';
import RoomManagement from './pages/admin/RoomManagement';
import BookingManagement from './pages/admin/BookingManagement';
import PricingAvailability from './pages/admin/PricingAvailability';
import ReviewsManagement from './pages/admin/ReviewsManagement';
import RevenueReports from './pages/admin/RevenueReports';
import HotelierSettings from './pages/admin/HotelierSettings';

// Context Providers
import { HotelProvider } from './context/HotelContext';

function App() {
  return (
    <HotelProvider>
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

            {/* Admin/Hotelier Pages */}
            <Route path="/admin/dashboard" element={<HotelierDashboard />} />
            <Route path="/admin/hotel-profile" element={<HotelProfileManagement />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/admin/pricing" element={<PricingAvailability />} />
            <Route path="/admin/reviews" element={<ReviewsManagement />} />
            <Route path="/admin/revenue" element={<RevenueReports />} />
            <Route path="/admin/settings" element={<HotelierSettings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HotelProvider>
  );
}

export default App;

