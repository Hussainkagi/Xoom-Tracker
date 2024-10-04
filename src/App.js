import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import Dashboard from "./pages/Dashboard/dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
