import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import styles from "./navbar.module.css";
import { Box, Modal, useMediaQuery } from "@mui/material";

function Navbar() {
  const [showModal, setShowModal] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
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
  const logout = () => {
    localStorage.removeItem("adminKey");
    window.location.reload();
  };

  const handleLogoutClick = () => {
    setShowModal(true); // Show the modal when logout is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
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
        {/* Bootstrap Modal */}
        <Modal open={showModal} onClose={() => handleCloseModal()}>
          <Box sx={style}>
            <div className={styles.exit__model}>
              <i className={`bi bi-exclamation-circle ${styles.icon}`}></i>
              <h4>Are you sure!</h4>
              <div className={styles.btn__box}>
                <button className="btn btn-primary">Cancel</button>
                <button className="btn btn-danger">Logout</button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </nav>
  );
}

export default Navbar;
