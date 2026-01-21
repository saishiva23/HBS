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

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

