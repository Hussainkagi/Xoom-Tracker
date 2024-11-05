import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./splash.css";

const SplashLoader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
      }}
    >
      <div className="loader">
        <div className="loader__balls">
          <div className="loader__balls__group">
            <div className="ball item1"></div>
            <div className="ball item1"></div>
            <div className="ball item1"></div>
          </div>
          <div className="loader__balls__group">
            <div className="ball item2"></div>
            <div className="ball item2"></div>
            <div className="ball item2"></div>
          </div>
          <div className="loader__balls__group">
            <div className="ball item3"></div>
            <div className="ball item3"></div>
            <div className="ball item3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashLoader;
