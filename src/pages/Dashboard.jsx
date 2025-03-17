import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Homepage from "./Homepage";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null); // State to store user data

  // Fetch authenticated user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({
          displayName: user.displayName, // User's name
          photoURL: user.photoURL, // User's profile photo URL
        });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar - 15% width */}
      <div className="w-[15%]">
        <Sidebar user={user} />
      </div>

      {/* Homepage - 85% width */}
      <div className="w-[85%]">
      <Outlet context={{ user }}/>
      </div>
    </div>
  );
};

export default Dashboard;