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
import UserPage from "./pages/Users/users";
import Subfields from "./pages/Subfields/fields";

function App() {
  // Check if 'accessToken' is in localStorage
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <Router>
      <div>
        {/* Only show Navbar if authenticated */}
        {isAuthenticated && <Navbar />}

        <div className="content-wrapper">
          <Routes>
            {/* Login Route */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
              }
            />

            {/* Home Route (Public) */}
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />

            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/overview"
              element={
                isAuthenticated ? <Overview /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/users"
              element={
                isAuthenticated ? <UserPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/subfields"
              element={
                isAuthenticated ? <Subfields /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
