import styles from "./home.module.css";
import Modal from "../../components/ModalComponent/model";
import React, { useEffect, useState } from "react";
import apiHelper from "../../utils/apiHelper/apiHelper";
import Splashscreen from "../../components/Splashscreen/splashloader";
import { styled } from "@mui/material/styles";
import { Autocomplete, stepButtonClasses, TextField } from "@mui/material";
import Toast from "../../components/Toast/toast";

const CustomAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
  "& .MuiInputBase-root": {
    height: "40px",
    padding: "0 8px",
  },
  "& .MuiInputLabel-root": {
    color: "#000",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "8px",
  },
  "& .MuiInputLabel-shrink": {
    top: 0,
    transform: "translate(0, -50%) scale(.75)",
    left: "14px",
  },
});

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");

  const handleShowModal = (type) => {
    setFormTitle(type);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const [employeeCode, setEmployeeCode] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30 AM");
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
  const [displayTime, setDisplayTime] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [aggregatorData, setAggregatorData] = useState([]);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const [formInputs, setFormInputs] = useState({
    empCode: "",
    empName: "",
    vehicleNo: "",
    aggregator: "",
    location: "",
    date: "",
    time: "",
    action: "",
    comments: "",
  });
  // **************************Get APIS**********************************

  useEffect(() => {
    fetchAllData();
  }, []);
  const fetchAllData = async () => {
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    setShowSplash(true);
    try {
      const [vehicleRes, locationRes, employeeRes, aggregatorRes] =
        await Promise.all([
          apiHelper.get("/vehicle", {}, headers),
          apiHelper.get("/location", {}, headers),
          apiHelper.get("/employee", {}, headers),
          apiHelper.get("/aggregator", {}, headers),
        ]);

      setVehicleData(vehicleRes?.data);
      setLocationData(locationRes?.data);
      setEmployeeData(employeeRes?.data);
      setAggregatorData(aggregatorRes?.data);
      setShowSplash(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setShowSplash(false);
    }
  };

  //Handle form fields
  const handleFormInputs = (key, value) => {
    setFormInputs((prevState) => ({
      ...prevState,
      [key]: value,
    }));
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

  const handleSelectInputChange = (input, type) => {
    if (type === 1) {
      handleFormInputs("empCode", input);

      const selectedEmployee = employeeData.find((emp) => emp.id === input);

      if (selectedEmployee) {
        handleFormInputs("empName", selectedEmployee.name);
      }
    } else if (type === 2) {
      handleFormInputs("location", input);
    } else if (type === 3) {
      handleFormInputs("vehicleNo", input);
    }
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);

    formatTimeWithSuffix(selectedTime);
  };

  const showToast = (type, title, subtitle) => {
    setToastConfig({
      show: true,
      title,
      subtitle,
      type,
    });
  };

  const handleCloseToast = () => {
    setToastConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const formatTimeWithSuffix = (time) => {
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);

    const suffix = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;

    handleFormInputs("time", `${displayHour}:${minute} ${suffix}`);
  };

  const resetForm = () => {
    handleFormInputs("empCode", "");
    handleFormInputs("empName", "");
    handleFormInputs("vehicleNo", "");
    handleFormInputs("aggregator", "");
    handleFormInputs("location", "");
    handleFormInputs("date", "");
    handleFormInputs("time", "");
    handleFormInputs("action", "");
    handleFormInputs("comments", "");

    setVehicleNo("");
    setEmployeeCode("");
    setName("");
    setDate("");
    setTime("");
    setLocation("");
    setVehiclePictures({
      front: null,
      back: null,
      left: null,
      right: null,
    });
    setVehiclePreviews({
      front: null,
      back: null,
      left: null,
      right: null,
    });
    setComments("");
  };
  const checkVehicleFields = () => {
    if (
      !formInputs.aggregator ||
      !formInputs.vehicleNo ||
      !formInputs.location ||
      !formInputs.empName ||
      !formInputs.empCode ||
      !formInputs.time ||
      !formInputs.date
    ) {
      showToast("error", "Error", "All fields are required");
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkVehicleFields()) {
      return;
    }
    setBtnLoader(true);
    // Create a new FormData instance
    const formData = new FormData();
    formData.append("vehicle", formInputs?.vehicleNo);
    formData.append("employee", formInputs?.empCode);
    formData.append("date", formInputs?.date);
    formData.append("time", formInputs?.time);
    formData.append("location", formInputs?.location);
    formData.append("comments", formInputs?.comments);
    formData.append("aggregator", formInputs?.aggregator);
    formData.append("action", !checkout ? "in" : "out");

    // if (vehiclePictures.back)
    //   formData.append("vehiclePictures[back]", vehiclePictures.back);
    // if (vehiclePictures.front)
    //   formData.append("vehiclePictures[front]", vehiclePictures.front);
    // if (vehiclePictures.left)
    //   formData.append("vehiclePictures[left]", vehiclePictures.left);
    // if (vehiclePictures.right)
    //   formData.append("vehiclePictures[right]", vehiclePictures.right);

    try {
      const response = await apiHelper.post("/transaction", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.success === true) {
        showToast(
          "success",
          "Success",
          checkout ? "Check out SuccessFull" : "Check in SuccessFull"
        );
        resetForm();
        setShowModal(false);
        setBtnLoader(false);
      } else {
        showToast(
          "error",
          "Error",
          !checkout
            ? "vehicle already checked in"
            : "vehicle already  checkedout"
        );
        setBtnLoader(false);
      }
      console.log("Response:", response);
    } catch (err) {
      showToast("error", "Error", "Something went wrong!");
      console.error("Error submitting form:", err);
    }
    setBtnLoader(false);
    console.log("Form Data:", formData);
  };

  const formContent = (
    <form>
      {/* Vehicle No Dropdown */}
      <div className="mb-3">
        <label htmlFor="vehicleNo" className="form-label">
          Vehicle No.
        </label>
        {vehicleData && (
          <CustomAutocomplete
            id="vehicleno"
            options={vehicleData}
            value={
              vehicleData.find(
                (vehicle) => vehicle.id === formInputs?.vehicleNo
              ) || null
            }
            onChange={(event, newValue) =>
              handleSelectInputChange(newValue ? newValue.id : "", 3)
            }
            getOptionLabel={(option) => option.vehicleNo}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a vehicle no."
                variant="outlined"
                placeholder="Search Vehicle no."
              />
            )}
          />
        )}
      </div>
      {/* Employee Code */}
      <div className="mb-3">
        <label htmlFor="employeeCode" className="form-label">
          Employee Code
        </label>
        {employeeData && (
          <CustomAutocomplete
            id="employeeCode"
            options={employeeData}
            value={
              employeeData.find((emp) => emp.id === formInputs?.empCode) || null
            }
            onChange={(event, newValue) =>
              handleSelectInputChange(newValue ? newValue.id : "", 1)
            }
            getOptionLabel={(option) => option.code}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select an employee"
                variant="outlined"
                placeholder="Search employees"
              />
            )}
          />
        )}
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
          value={formInputs?.empName}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <input
          type="date"
          className="form-control"
          id="date"
          value={formInputs?.date}
          onChange={(e) => handleFormInputs("date", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="time" className="form-label">
          Time
        </label>
        <div className="d-flex gap-2">
          <input
            type="time"
            className="form-control"
            id="time"
            value={formInputs?.time}
            onChange={handleTimeChange}
          />
        </div>
      </div>
      {/* Location Dropdown */}
      <div className="mb-3">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        {locationData && (
          <CustomAutocomplete
            id="location"
            options={locationData}
            value={
              locationData.find((loc) => loc.id === formInputs?.location) ||
              null
            }
            onChange={(event, newValue) =>
              handleSelectInputChange(newValue ? newValue.id : "", 2)
            }
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a location"
                variant="outlined"
                placeholder="Search location"
              />
            )}
          />
        )}
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

        {/* Left and Right */}
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
          value={formInputs?.comments}
          onChange={(e) => handleFormInputs("comments", e.target.value)}
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
          onClick={() => {
            setCheckout(false);
            handleShowModal("Check In");
          }}
        >
          <i className="bi bi-arrow-bar-left"></i>Check In
        </button>
        <button
          type="button"
          className={`btn btn-primary btn-lg ${styles.button__checkin}`}
          onClick={() => {
            setCheckout(true);
            handleShowModal("Check Out");
          }}
          style={{
            backgroundColor: "red",
            border: "none",
          }}
        >
          Check Out<i className="bi bi-arrow-bar-right"></i>
        </button>
      </div>
      <Modal
        title={formTitle}
        content={formContent}
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit}
        disabled={btnLoader}
      />

      {showSplash && <Splashscreen />}
      {
        <Toast
          open={toastConfig.show}
          title={toastConfig.title}
          subtitle={toastConfig.subtitle}
          type={toastConfig.type}
          onClose={handleCloseToast}
        />
      }
    </div>
  );
};

export default Home;
