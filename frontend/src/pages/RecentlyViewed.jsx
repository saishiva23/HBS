import { HeartIcon } from "@heroicons/react/24/outline";
import AccountLayout from "../components/AccountLayout";
import { useNavigate } from "react-router-dom";

const RecentlyViewed = () => {
  const navigate=useNavigate();
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
        <button onClick={() => navigate("/login")}
        className="whitespace-nowrap px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-blue-600 transition">
          SignIn
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recently viewed</h1>
      <div className="bg-gray-50 rounded-xl p-12 flex flex-col items-center justify-center text-center">
         <p className="text-gray-600">No recently viewed items.</p>
      </div>
    </AccountLayout>
  );
};

export default RecentlyViewed;
