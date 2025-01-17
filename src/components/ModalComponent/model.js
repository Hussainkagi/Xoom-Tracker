import React from "react";
import Loader from "../Loader/buttonLoader";

const Modal = ({
  title,
  content,
  show,
  handleClose,
  onSubmit,
  disabled = false,
  showSubmit = true,
}) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            {showSubmit && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={disabled}
                style={{
                  backgroundColor: "#9acb3b",
                  border: "none",
                }}
              >
                {disabled ? <Loader /> : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
