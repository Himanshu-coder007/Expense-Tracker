import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firestore instance and auth
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore"; // Import Firestore functions

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
  });

  // Fetch expenses from Firestore on component mount
  useEffect(() => {
    if (auth.currentUser) {
      const expensesCollection = collection(db, "expenses");
      const q = query(expensesCollection, where("userId", "==", auth.currentUser.uid)); // Filter by userId
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expenseList);
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expensesCollection = collection(db, "expenses");
      await addDoc(expensesCollection, {
        ...formData,
        userId: auth.currentUser.uid, // Add the user's UID
      });
      setFormData({ date: "", category: "", amount: "", description: "" }); // Reset form
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

       {/* Header */}
       <div className="mb-8">
        <h1 className="text-2xl font-bold">Expense</h1>
        <p className="text-gray-600">Manage your expense transactions.</p>
      </div>
      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Total Expenses</h2>
        <p className="text-2xl font-bold text-red-600">
          $
          {expenses.reduce(
            (total, expense) => total + Number(expense.amount),
            0
          )}
        </p>
      </div>

      {/* Expense List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Expense Transactions</h2>
        <div
          className="overflow-x-auto"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="py-2">{expense.date}</td>
                  <td className="py-2">{expense.category}</td>
                  <td className="py-2 text-red-600">-${expense.amount}</td>
                  <td className="py-2">{expense.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expense;