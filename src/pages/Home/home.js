import styles from "./home.module.css";
import Modal from "../../components/ModalComponent/model";
import React, { useState } from "react";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const formContent = (
    <form>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input type="text" className="form-control" id="name" />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input type="email" className="form-control" id="email" />
      </div>
    </form>
  );

  return (
    <div className="container">
      <span className={""}>Welcome to Xoom Assets Tracker</span>
      <div className={styles.main__container}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{
            backgroundColor: "#9acb3b",
            border: "none",
          }}
          onClick={handleShowModal}
        >
          Check In
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{
            backgroundColor: "red",
            border: "none",
          }}
        >
          Check Out
        </button>
      </div>
      <Modal
        title="User Form"
        content={formContent}
        show={showModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
