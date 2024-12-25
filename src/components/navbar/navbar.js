import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.jpeg";
import styles from "./navbar.module.css";
import { Box, Modal, useMediaQuery } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [access, setAccess] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

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

  useEffect(() => {
    const role = localStorage.getItem("role");
    setAccess(role);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setOpacity(scrollTop > 50 ? 0.8 : 1);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path); // Navigate only if the target path is different
    }
  };

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  // Determine active class based on the current path
  const isActive = (path) =>
    location.pathname === path ? { color: "#9acb3b", fontWeight: "bold" } : {};

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-dark`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        opacity: opacity,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid">
        <a
          className="navbar-brand"
          onClick={() => handleNavigation("/")}
          style={isActive("/")}
        >
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
            <li className={`nav-item ${styles.item__pointer}`}>
              <a
                className="nav-link"
                onClick={() => handleNavigation("/")}
                style={isActive("/")}
              >
                Home
              </a>
            </li>
            <li className={`nav-item ${styles.item__pointer}`}>
              <a
                className="nav-link"
                onClick={() => handleNavigation("/dashboard")}
                style={isActive("/dashboard")}
              >
                Dashboard
              </a>
            </li>
            <li className={`nav-item ${styles.item__pointer}`}>
              <a
                className="nav-link"
                onClick={() => handleNavigation("/overview")}
                style={isActive("/overview")}
              >
                Overview
              </a>
            </li>

            {access !== "Viewer" && (
              <li className={`nav-item ${styles.item__pointer}`}>
                <a
                  className="nav-link"
                  onClick={() => handleNavigation("/subfields")}
                  style={isActive("/subfields")}
                >
                  Subfields
                </a>
              </li>
            )}
            {access === "Owner" && (
              <li className={`nav-item ${styles.item__pointer}`}>
                <a
                  className="nav-link"
                  onClick={() => handleNavigation("/users")}
                  style={isActive("/users")}
                >
                  Users
                </a>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${styles.item__pointer}`}>
              <a className="nav-link active" onClick={handleLogoutClick}>
                Logout
              </a>
            </li>
          </ul>
        </div>

        <Modal open={showModal} onClose={handleCloseModal}>
          <Box sx={style}>
            <div className={styles.exit__model}>
              <i className={`bi bi-exclamation-circle ${styles.icon}`}></i>
              <h4>Are you sure you want to logout?</h4>
              <div className={styles.btn__box}>
                <button className="btn btn-primary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={logout}>
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
