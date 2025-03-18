import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase"; // Import Firestore instance
import { collection, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import TransactionChart from "../components/TransactionChart";
import TransactionSection from "../components/TransactionSection";

const Homepage = () => {
  // Access user data from Outlet context
  const { user } = useOutletContext();

  // State for totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  // Fetch transactions from Firestore on component mount
  useEffect(() => {
    // Fetch incomes
    const incomesCollection = collection(db, "incomes");
    const unsubscribeIncomes = onSnapshot(incomesCollection, (snapshot) => {
      const incomeList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        type: "Income", // Add type for incomes
      }));
      const totalIncome = incomeList.reduce(
        (total, income) => total + Number(income.amount),
        0
      );
      setTotalIncome(totalIncome);
    });

    // Fetch expenses
    const expensesCollection = collection(db, "expenses");
    const unsubscribeExpenses = onSnapshot(expensesCollection, (snapshot) => {
      const expenseList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        type: "Expense", // Add type for expenses
      }));
      const totalExpenses = expenseList.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      );
      setTotalExpenses(totalExpenses);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeIncomes();
      unsubscribeExpenses();
    };
  }, []);

  // Calculate net balance whenever totalIncome or totalExpenses changes
  useEffect(() => {
    setNetBalance(totalIncome - totalExpenses);
  }, [totalIncome, totalExpenses]);

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
          <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-600">${totalExpenses}</p>
        </div>

        {/* Net Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Net Balance</h2>
          <p className="text-2xl font-bold text-blue-600">${netBalance}</p>
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