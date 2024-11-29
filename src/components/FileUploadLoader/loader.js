import React from "react";

import "./fileLoader.css";

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
        <label>Relax while we analyse your file...</label>
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default SplashLoader;
