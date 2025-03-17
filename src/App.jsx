import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Auth from "./Auth/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import IncomePage from "./pages/Income"; // Add this
import ExpensePage from "./pages/Expense"; // Add this

function App() {
  return (
    <Router>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes */}
          <Route index element={<Homepage />} /> {/* Default route */}
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;