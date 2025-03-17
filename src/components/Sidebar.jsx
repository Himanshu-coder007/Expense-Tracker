import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { FaHome, FaMoneyBill, FaSignOutAlt, FaUser, FaChartLine } from "react-icons/fa";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  // Define handleLogout inside the component
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {/* Financial Tracker Heading */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <FaChartLine className="w-8 h-8 text-blue-400" />
        <h1 className="ml-3 text-xl font-bold text-blue-400">Financial Tracker</h1>
      </div>

      {/* User Profile Section */}
      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <span className="mt-2 text-sm font-semibold">
          {user?.displayName || "Username"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-10">
        <Link
          to="/dashboard"
          className="flex items-center px-6 py-2 text-gray-300 hover:bg-gray-700"
        >
          <FaHome className="w-5 h-5" />
          <span className="ml-3">Homepage</span>
        </Link>
        <Link
          to="/dashboard/income"
          className="flex items-center px-6 py-2 text-gray-300 hover:bg-gray-700"
        >
          <FaMoneyBill className="w-5 h-5" />
          <span className="ml-3">Income</span>
        </Link>
        <Link
          to="/dashboard/expense"
          className="flex items-center px-6 py-2 text-gray-300 hover:bg-gray-700"
        >
          <FaMoneyBill className="w-5 h-5" />
          <span className="ml-3">Expense</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-2 text-gray-300 hover:bg-gray-700"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;