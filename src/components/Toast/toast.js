import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Toast = ({ title, subtitle, type = "success", open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000} // 4 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ minWidth: "250px", width: "100%" }}
      >
        <strong>{title}</strong>
        <div>{subtitle}</div>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
