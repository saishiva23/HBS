import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/AccountLayout";
import { FaBell } from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-4">Help and support</h1>
      <p className="text-gray-600 mb-6">How can we help you?</p>

      <div className="bg-white shadow rounded-xl p-6 max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-yellow-400 text-black p-3 rounded-full">
            <FaBell/>
          </div>
          <p className="font-medium">
            Need priority support? Sign in or create an account to get help faster.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
          onClick={() => navigate("/login")}
          className="border px-6 py-2 rounded-lg font-semibold hover:bg-gray-50">
            Sign in or create account
          </button>
          <button className="border px-6 py-2 rounded-lg font-semibold hover:bg-gray-50">
            Visit help center
          </button>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Help;
