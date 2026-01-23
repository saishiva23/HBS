import AccountLayout from "../components/AccountLayout";


const Favorites = () => {
  return (
    <AccountLayout>
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
