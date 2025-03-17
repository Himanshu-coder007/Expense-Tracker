// src/components/TransactionSection.jsx
import React from "react";

const TransactionSection = ({
  sortByDate,
  setSortByDate,
  sortByCategory,
  setSortByCategory,
  categories,
  sortedTransactions,
}) => {
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