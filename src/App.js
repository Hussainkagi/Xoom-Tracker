import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import Dashboard from "./pages/Dashboard/dashboard";
import Overview from "./pages/Overview/overview";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Check if 'adminKey' is present in localStorage
  useEffect(() => {
    // const adminKey = localStorage.getItem("adminKey");
    // if (adminKey) {
    //   setIsAuthenticated(true); // Set authenticated if the key exists
    // } else {
    //   setIsAuthenticated(false); // If no key, user is not authenticated
    // }
  }, []);

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar />}{" "}
        {/* Show Navbar only if authenticated */}
        <div className="content-wrapper">
          <Routes>
            {/* Redirect to login if not authenticated */}
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
            {/* Public home route */}
            <Route path="/" element={<Home />} />
            {/* Dashboard route */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/overview"
              element={true ? <Overview /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
