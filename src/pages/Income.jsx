import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firestore instance and auth
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Import Firestore functions

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
  });
  const [editId, setEditId] = useState(null); // Track the ID of the income being edited

  // Fetch incomes from Firestore on component mount
  useEffect(() => {
    if (auth.currentUser) {
      const incomesCollection = collection(db, "incomes");
      const q = query(incomesCollection, where("userId", "==", auth.currentUser.uid)); // Filter by userId
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const incomeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncomes(incomeList);
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
      const incomesCollection = collection(db, "incomes");
      if (editId) {
        // If editing, update the existing document
        const incomeDoc = doc(db, "incomes", editId);
        await updateDoc(incomeDoc, formData);
        setEditId(null); // Reset edit mode
      } else {
        // If adding, create a new document
        await addDoc(incomesCollection, {
          ...formData,
          userId: auth.currentUser.uid, // Add the user's UID
        });
      }
      setFormData({ date: "", category: "", amount: "", description: "" }); // Reset form
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  const handleEdit = (income) => {
    // Set the form data to the income being edited
    setFormData({
      date: income.date,
      category: income.category,
      amount: income.amount,
      description: income.description,
    });
    setEditId(income.id); // Set the ID of the income being edited
  };

  const handleDelete = async (id) => {
    try {
      const incomeDoc = doc(db, "incomes", id);
      await deleteDoc(incomeDoc);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Income</h1>
        <p className="text-gray-600">Manage your income transactions.</p>
      </div>

      {/* Add/Edit Income Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editId ? "Edit Income" : "Add Income"}
        </h2>
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
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
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
            {editId ? "Update Income" : "Add Income"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setFormData({ date: "", category: "", amount: "", description: "" });
                setEditId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Total Income Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Total Income</h2>
        <p className="text-2xl font-bold text-green-600">
          ${incomes.reduce((total, income) => total + Number(income.amount), 0)}
        </p>
      </div>

      {/* Income List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Income Transactions</h2>
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
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="border-b">
                  <td className="py-2">{income.date}</td>
                  <td className="py-2">{income.category}</td>
                  <td className="py-2 text-green-600">+${income.amount}</td>
                  <td className="py-2">{income.description}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleEdit(income)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Income;