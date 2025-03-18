import React, { useState } from "react";

const TransactionSection = () => {
  // Example transactions data
  const transactions = [
    {
      id: 1,
      date: "2023-10-01",
      category: "Salary",
      amount: 2000,
      type: "Income",
    },
    {
      id: 2,
      date: "2023-10-02",
      category: "Groceries",
      amount: 200,
      type: "Expense",
    },
    {
      id: 3,
      date: "2023-10-03",
      category: "Rent",
      amount: 1000,
      type: "Expense",
    },
    {
      id: 4,
      date: "2023-10-04",
      category: "Freelance Work",
      amount: 500,
      type: "Income",
    },
    {
      id: 5,
      date: "2023-10-05",
      category: "Entertainment",
      amount: 50,
      type: "Expense",
    },
  ];

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