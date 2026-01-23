import AccountLayout from "../components/AccountLayout";

const Bookings = () => {
  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings</h1>
      <div className="bg-gray-50 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <p className="text-gray-600">No bookings yet.</p>
      </div>
    </AccountLayout>
  );
};

export default Bookings;
