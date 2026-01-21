import SearchBar from "../components/SearchBar";
import { FaHotel, FaCreditCard, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PopularSearches from "../components/PopularSearches";
import RecentlyViewedHotels from "../components/RecentlyViewedHotels";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Personalized Greeting */}
        <h1 className="text-3xl font-bold text-center md:text-left dark:text-white transition-colors">
          {isAuthenticated
            ? `Ready to find a great hotel deal, ${user?.name}?`
            : "Save up to 55% on your next hotel stay"}
        </h1>

        {isAuthenticated && (
          <p className="text-gray-600 mt-2 text-lg text-center md:text-left dark:text-gray-300">
            Save up to 55% on your next hotel stay
          </p>
        )}

        <SearchBar />

        {/* Recently Viewed Hotels - Only shows if user has viewed hotels */}
        <RecentlyViewedHotels />

        {/* Popular Searches - Cities & Destinations tabs */}
        <PopularSearches />
      </div>

      {/* How It Works - Full breadth background with centered content */}
      <div className="py-20 bg-white dark:bg-gray-800 border-y dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <FaHotel className="text-blue-600 dark:text-blue-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Search</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find hotels by location, dates, and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <FaStar className="text-blue-600 dark:text-blue-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Compare</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Read reviews and compare prices to find the best deal
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <FaCreditCard className="text-blue-600 dark:text-blue-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Book</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure your booking with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
