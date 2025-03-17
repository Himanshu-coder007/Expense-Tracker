// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If the user is not authenticated, redirect to the login page
        navigate("/");
      }
      setLoading(false); // Set loading to false after authentication check
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [navigate]);

  // Show a loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;