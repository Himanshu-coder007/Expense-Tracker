import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TransactionChart = ({ transactions }) => {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (transaction.type === "Income") {
      acc[date].income += Number(transaction.amount);
    } else {
      acc[date].expense += Number(transaction.amount);
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

  // Format date for X-axis (e.g., "01/10" for October 1st)
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}`;
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">Income: ${payload[0].value}</p>
          <p className="text-red-600">Expense: ${payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Transactions for the Current Month
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Increased bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate} // Format the date
            interval={0} // Show every single date
            angle={-45} // Rotate labels for better readability
            textAnchor="end"
            tick={{ fontSize: 12 }} // Adjust font size
          />
          <YAxis domain={[0, "auto"]} /> {/* Auto-adjust Y-axis range */}
          <Tooltip content={<CustomTooltip />} /> {/* Custom tooltip */}
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#82ca9d"
            name="Income"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ff6b6b"
            name="Expense"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;