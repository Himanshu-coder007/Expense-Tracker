import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, onSnapshot } from "firebase/firestore"; // Import Firestore functions

const TransactionSection = () => {
  // State for transactions
  const [transactions, setTransactions] = useState([]);

  // State for sorting
  const [sortByDate, setSortByDate] = useState("newest"); // "newest" or "oldest"
  const [sortByCategory, setSortByCategory] = useState("All"); // "All" or specific category

  // Categories for dropdown
  const categories = [
    "All",
    "Salary",
    "Groceries",
    "Rent",
    "Freelance Work",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Health & Fitness",
    "Shopping",
    "Education",
    "Travel",
    "Debt & Loans",
    "Other",
  ];

  // Fetch transactions from Firestore on component mount
  useEffect(() => {
    // Fetch incomes
    const incomesCollection = collection(db, "incomes");
    const unsubscribeIncomes = onSnapshot(incomesCollection, (snapshot) => {
      const incomeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "Income", // Add type for incomes
      }));
      setTransactions((prev) => [
        ...prev.filter((t) => t.type !== "Income"),
        ...incomeList,
      ]);
    });

    // Fetch expenses
    const expensesCollection = collection(db, "expenses");
    const unsubscribeExpenses = onSnapshot(expensesCollection, (snapshot) => {
      const expenseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "Expense", // Add type for expenses
      }));
      setTransactions((prev) => [
        ...prev.filter((t) => t.type !== "Expense"),
        ...expenseList,
      ]);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeIncomes();
      unsubscribeExpenses();
    };
  }, []);

  // Sort transactions by date and filter by category
  const sortedTransactions = transactions
    .filter((transaction) =>
      sortByCategory === "All" ? true : transaction.category === sortByCategory
    )
    .sort((a, b) =>
      sortByDate === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  return (
    <>
      {/* Sorting Dropdowns */}
      <div className="flex gap-4 mb-8">
        {/* Sort by Date Dropdown */}
        <select
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Sort by Category Dropdown */}
        <select
          value={sortByCategory}
          onChange={(e) => setSortByCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">{transaction.category}</td>
                  <td
                    className={`py-2 ${
                      transaction.type === "Income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "Income" ? "+" : "-"}$
                    {transaction.amount}
                  </td>
                  <td className="py-2">{transaction.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionSection;