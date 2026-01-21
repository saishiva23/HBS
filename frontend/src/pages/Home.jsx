import SearchBar from "../components/SearchBar";
import Footer from './../components/Footer';
import { FaSearch, FaCalendar, FaUsers, FaHotel, FaCreditCard, FaStar } from 'react-icons/fa';
import PopularSearches from "../components/PopularSearches";


function Home() {
  return (
    <div className="max-w-[1200px] mx-auto mt-8 px-4">


      <h1 className="text-3xl font-bold text-center md:text-left">
        Save up to 55% on your next hotel stay
      </h1>

      {/* <p className="text-gray-600 mt-2 text-lg text-center md:text-left">
        Get Offers 
      </p> */}

      <SearchBar />
      <PopularSearches />
      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHotel className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-gray-600">
                Find hotels by location, dates, and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compare</h3>
              <p className="text-gray-600">
                Read reviews and compare prices to find the best deal
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Book</h3>
              <p className="text-gray-600">
                Secure your booking with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
