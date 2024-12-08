import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import styles from "./navbar.module.css";
import { Box, Modal, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Check for mobile screen size
  const isMobile = useMediaQuery("(max-width:600px)");

  // Style for the modal box, responsive design
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? 250 : 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Show logout modal
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  // Close logout modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logout user and redirect to login page
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="logo" className={styles.logo__image} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/dashboard"
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/overview"
              >
                Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/users">
                Users
              </a>
            </li>
          </ul>

          {/* Logout Button Aligned to the End */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
                onClick={handleLogoutClick}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Logout Confirmation Modal */}
        <Modal open={showModal} onClose={handleCloseModal}>
          <Box sx={style}>
            <div className={styles.exit__model}>
              <i className={`bi bi-exclamation-circle ${styles.icon}`}></i>
              <h4>Are you sure you want to logout?</h4>
              <div className={styles.btn__box}>
                <button
                  className="btn btn-primary"
                  onClick={handleCloseModal} // Close the modal
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={logout} // Perform logout and navigate
                >
                  Logout
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </nav>
  );
}

export default Navbar;
