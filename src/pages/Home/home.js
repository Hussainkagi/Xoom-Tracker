import styles from "./home.module.css";
import Modal from "../../components/ModalComponent/model";
import React, { useState } from "react";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [employeeCode, setEmployeeCode] = useState("");
  const [name, setName] = useState("");
  const [vehiclePictures, setVehiclePictures] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [vehiclePreviews, setVehiclePreviews] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [comments, setComments] = useState("");
  const [locations] = useState(["Abuhail", "al-diera", "chandni chowk"]);
  const [vehicles] = useState(["BMW", "Audi", "Ferrari"]);
  const [empCode] = useState(["XDS4500", "XDS4501", "XDS4502"]);

  // Simulating fetching name based on employee code
  const handleEmployeeCodeChange = (e) => {
    const code = e.target.value;
    setEmployeeCode(code);
    if (code === "EMP001") {
      setName("John Doe");
    } else if (code === "EMP002") {
      setName("Jane Smith");
    } else {
      setName("");
    }
  };

  // Handling picture uploads and showing preview
  const handlePictureChange = (side, file) => {
    setVehiclePictures((prevPictures) => ({
      ...prevPictures,
      [side]: file,
    }));

    // Create preview URL for the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setVehiclePreviews((prevPreviews) => ({
        ...prevPreviews,
        [side]: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const formContent = (
    <form>
      {/* Location Dropdown */}
      <div className="mb-3">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <select className="form-select" id="location">
          <option>Select a location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Code */}
      <div className="mb-3">
        <label htmlFor="employeeCode" className="form-label">
          Employee Code
        </label>
        <select className="form-select" id="vehicleNo">
          <option>Select a vehicle</option>
          {empCode.map((vehicle, index) => (
            <option key={index} value={vehicle}>
              {vehicle}
            </option>
          ))}
        </select>
      </div>

      {/* Name (Automatically fetched based on Employee Code) */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          readOnly
        />
      </div>

      {/* Vehicle No Dropdown */}
      <div className="mb-3">
        <label htmlFor="vehicleNo" className="form-label">
          Vehicle No.
        </label>
        <select className="form-select" id="vehicleNo">
          <option>Select a vehicle</option>
          {vehicles.map((vehicle, index) => (
            <option key={index} value={vehicle}>
              {vehicle}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Vehicle Pictures (Four sides) */}
      <div className="mb-3">
        <label className="form-label">Upload Vehicle Pictures</label>
        <div className="row">
          {/* Front and Back */}
          <div className="col-md-6 mb-3">
            <label>Front</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handlePictureChange("front", e.target.files[0])}
            />
            {vehiclePreviews.front && (
              <img
                src={vehiclePreviews.front}
                alt="Front"
                className="img-thumbnail mt-2"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Back</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handlePictureChange("back", e.target.files[0])}
            />
            {vehiclePreviews.back && (
              <img
                src={vehiclePreviews.back}
                alt="Back"
                className="img-thumbnail mt-2"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
        </div>

        {/* Left and Right  */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Left</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handlePictureChange("left", e.target.files[0])}
            />
            {vehiclePreviews.left && (
              <img
                src={vehiclePreviews.left}
                alt="Left"
                className="img-thumbnail mt-2"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Right</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handlePictureChange("right", e.target.files[0])}
            />
            {vehiclePreviews.right && (
              <img
                src={vehiclePreviews.right}
                alt="Right"
                className="img-thumbnail mt-2"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-3">
        <label htmlFor="comments" className="form-label">
          Comments
        </label>
        <textarea
          className="form-control"
          id="comments"
          rows="3"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        ></textarea>
      </div>
    </form>
  );

  return (
    <div className="main_container">
      <span className={styles.header}>Welcome to Xoom Assets Tracker</span>
      <div className={styles.main__container}>
        <button
          type="button"
          className={`btn btn-primary btn-lg ${styles.button__checkin}`}
          style={{
            backgroundColor: "#9acb3b",
            border: "none",
          }}
          onClick={handleShowModal}
        >
          <i class="bi bi-arrow-bar-left"></i>Check In
        </button>
        <button
          type="button"
          className={`btn btn-primary btn-lg ${styles.button__checkin}`}
          style={{
            backgroundColor: "red",
            border: "none",
          }}
        >
          Check Out<i class="bi bi-arrow-bar-right"></i>
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
