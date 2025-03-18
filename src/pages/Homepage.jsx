import React from "react";
import { useOutletContext } from "react-router-dom";
import TransactionChart from "../components/TransactionChart";
import TransactionSection from "../components/TransactionSection"; // Import the combined component

const Homepage = () => {
  // Access user data from Outlet context
  const { user } = useOutletContext();

  return (
    <div className="h-full p-8 bg-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome Back, {user?.displayName || "User"}!
        </h1>
        <p className="text-gray-600">Here's an overview of your finances.</p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">$5,000</p>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-600">$3,000</p>
        </div>

        {/* Net Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Net Balance</h2>
          <p className="text-2xl font-bold text-blue-600">$2,000</p>
        </div>
      </div>

      {/* Transaction Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction Overview</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <TransactionChart transactions={[]} /> {/* Pass empty array or mock data if needed */}
        </div>
      </div>

      {/* Combined Sorting Dropdowns and Recent Transactions Table */}
      <TransactionSection />
    </div>
  );
};

export default Homepage;