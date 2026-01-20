import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/AccountLayout";
import { HeartIcon } from '@heroicons/react/24/outline';
  

const Favorites = () => {
const navigate = useNavigate();
  return (
    <AccountLayout>
      {/* Banner */}
      <div className="bg-white border rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <HeartIcon className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Keep track of stays you like</h3>
            <p className="text-gray-600 text-sm">Save your favorite stays to your account and create your own lists.</p>
          </div>
        </div>
        <button
        onClick={() => navigate("/login")}
        className="whitespace-nowrap px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-blue-600 transition">
          SignIn
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your favorites</h1>

      {/* Empty State */}
      <div className="bg-gray-50 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <div className="mb-6 opacity-50">
            <svg className="w-32 h-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your next stay <span className="text-gray-500 font-normal">(0 stays)</span></h3>
      </div>
    </AccountLayout>
  );
};

export default Favorites;
