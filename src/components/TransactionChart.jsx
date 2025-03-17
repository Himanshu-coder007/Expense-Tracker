import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const TransactionChart = ({ transactions }) => {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (transaction.type === "Income") {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expense += transaction.amount;
    }
    return acc;
  }, {});

  // Get the current month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Prepare data for the chart (all days of the current month)
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1)
      .toISOString()
      .split("T")[0];
    return {
      date,
      income: groupedTransactions[date]?.income || 0,
      expense: groupedTransactions[date]?.expense || 0,
    };
  });

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Transactions for the Current Month
      </h2>
      <LineChart
        width={800}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[50, 4000]} /> {/* Set Y-axis range from $50 to $4000 */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#82ca9d" />
        <Line type="monotone" dataKey="expense" stroke="#ff6b6b" />
      </LineChart>
    </div>
  );
};

export default TransactionChart;