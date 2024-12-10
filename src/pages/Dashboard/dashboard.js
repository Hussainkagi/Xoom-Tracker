import styles from "./dashboard.module.css";
import React, { useState, useRef, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { Modal, Button, Menu, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import apiHelper from "../../utils/apiHelper/apiHelper";
import placeholder from "../../assets/Images/noimage.jpg";
import * as XLSX from "xlsx";
import ButtonLoader from "../../components/Loader/buttonLoader";
import Splashscreen from "../../components/Splashscreen/splashloader";

import FileLoader from "../../components/FileUploadLoader/loader";
import Toast from "../../components/Toast/toast";

let themeColor = "#9acb3b";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const style2 = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9acb3b",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9acb3b",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9acb3b",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "grey",
          "&.Mui-focused": {
            color: "grey",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: "#9acb3b",
        },
        indicator: {
          backgroundColor: "#9acb3b",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#9acb3b",
          },
          "&:hover": {
            color: "#9acb3b",
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#1976d2",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-selected": {
            color: "lime",
          },
        },
      },
    },
  },
});
const Dashboard = () => {
  const [value, setValue] = useState(0);
  const fileInputRef = useRef(null);
  const transactionFileInput = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);

  // Table Data States
  const [employeeData, setEmployeeData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [fullImage, setFullImage] = useState("");
  const [transactionModal, setTransactionModal] = useState(false);
  const [showFileLoader, setFileLoader] = useState(false);

  const [modalForm, showModalform] = useState(false);
  const [manual, setManual] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Employee Form Field States
  const [empCode, setEmpCode] = useState("");
  const [empName, setEmpName] = useState("");

  // Vehicle form field states
  const [vehicleNo, setvehicleNo] = useState("");
  const [vehicleModel, setvehicleModel] = useState("");
  const [vehicleFrom, setVehiclefrom] = useState("");

  // Locstion form states
  const [locationName, setLocationName] = useState("");
  const [locationFull, setLocationfull] = useState("");

  //Transaction Allocation Flow States
  const [TafileData, setTaFileData] = useState(null);
  const [count, setCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactionBtn, setTransactionBtn] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle the button click to trigger the file input
  const handleButtonClick = () => {
    fileInputRef.current.click();
    setAnchorEl(false);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileData(file);
      // Process the file as needed
    }
  };

  const handleCloseToast = () => {
    setToastConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name } = e.target;

    switch (value) {
      case 1:
        if (name === "empCode") setEmpCode(e.target.value);
        if (name === "empName") setEmpName(e.target.value);

      case 2:
        if (name === "vehicleno") setvehicleNo(e.target.value);
        if (name === "vehicleModel") setvehicleModel(e.target.value);
        if (name === "vehicleFrom") setVehiclefrom(e.target.value);

      case 3:
        if (name === "locName") setLocationName(e.target.value);
        if (name === "fulladdress") setLocationfull(e.target.value);
    }
  };

  const handleFileUploadClick = () => {
    transactionFileInput.current.click();
  };

  // Handle file upload and Excel processing
  const handleFileUpload = (event) => {
    setFileLoader(true);
    setTimeout(() => {
      setFileLoader(false);
    }, 3000);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet is the one with data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process the data to count rows and calculate total amount
        if (sheetData.length > 1) {
          const rows = sheetData.slice(1); // Skip header
          const amountIndex = sheetData[0].indexOf("amount"); // Find "amount" column index

          if (amountIndex !== -1) {
            const total = rows.reduce(
              (sum, row) => sum + (parseFloat(row[amountIndex]) || 0),
              0
            );
            setCount(rows.length);
            setTotalAmount(total.toFixed(2));
            setTransactionBtn(false); // Enable the submit button
          } else {
            alert("The uploaded file does not have a column named 'amount'.");
          }
        } else {
          alert("The uploaded file seems to be empty.");
        }
      };

      reader.readAsArrayBuffer(file);
      setTaFileData(file); // Save the file data
    }
  };
  // *********************************Handle Image Model START***********************************
  const handleImageClick = (images) => {
    // Open modal with selected images
    setSelectedImages(images);
    setShowImageModal(true);
  };

  const handleFullImageClick = (url) => {
    // Open modal for full image view
    setFullImage(url);
    setShowFullImageModal(true);
  };

  function extractGoogleDriveFileId(url) {
    const regex = /\/d\/(.*?)\/view/;
    const match = url.match(regex);
    return match ? match[1] : null; // Returns the ID if found, otherwise null
  }

  // *********************************Handle Image Model END***********************************

  //******************************APIS STARTS******************************** */

  // ************************* Fetch All Data**********************'
  const fetchAllData = async () => {
    setShowSplash(true);
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      const [transactionRes, vehicleRes, locationRes, employeeRes] =
        await Promise.all([
          apiHelper.get("/transaction", {}, headers),
          apiHelper.get("/vehicle", {}, headers),
          apiHelper.get("/location", {}, headers),
          apiHelper.get("/employee", {}, headers),
        ]);

      setTransactionData(transactionRes.data);
      setVehicleData(vehicleRes.data);
      setLocationData(locationRes.data);
      setEmployeeData(employeeRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShowSplash(false); // Hide splash loader once all data is fetched
    }
  };
  //  ***********************************Employee APIs *******************************
  const getEmployeeData = async () => {
    let response = await apiHelper.get("/employee");

    setEmployeeData(response.data);
  };

  const uploadEmployeeData = async (file) => {
    try {
      const formData = new FormData();
      // formData.append("file", file);+
      if (file) {
        const isExcelFile =
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        if (isExcelFile && !manual) {
          setBtnLoader(true);
          setShowSplash(true);
          formData.append("file", file);
          const response = await apiHelper.post("/employee/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          getEmployeeData();
          setBtnLoader(false);
          setShowSplash(false);

          alert(response.message || "Upload successful");
        } else {
          setShowSplash(false);
          setBtnLoader(false);
          alert("Oops! Uploaded file was not in required format.");
        }
      } else if (manual) {
        setBtnLoader(true);
        setShowSplash(true);
        let body = {
          code: empCode.toUpperCase(),
          name: empName,
          status: "active",
          isDeleted: false,
        };

        const response = await apiHelper.post("/employee", body, {
          headers: { "Content-Type": "application/json" },
        });
        showModalform(false);
        setManual(false);
        setBtnLoader(false);
        setShowSplash(false);
        setEmpCode("");
        setEmpName("");
        getEmployeeData();
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  //  ***********************************Location APIs *******************************
  const getLocationData = async () => {
    let response = await apiHelper.get("/location");
    setLocationData(response.data);
  };

  const addLocationData = async () => {
    setBtnLoader(true);
    setShowSplash(true);
    try {
      let body = {
        name: locationName,
        fullAddress: locationFull,
      };
      const response = await apiHelper.post("/location", body, {
        headers: { "Content-Type": "application/json" },
      });
      showModalform(false);
      setManual(false);
      setLocationName("");
      setLocationfull("");
      getLocationData();
      setBtnLoader(false);
      setShowSplash(false);
    } catch (error) {
      console.error("Error adding location:", error.message);
      alert("Failed to add location.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  //  ***********************************Vehicle APIs *******************************
  const getVehicleData = async () => {
    let response = await apiHelper.get("/vehicle");
    setVehicleData(response.data);
  };

  const uploadVehicleData = async (file) => {
    try {
      const formData = new FormData();
      // formData.append("file", file);+
      if (file) {
        const isExcelFile =
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        if (isExcelFile && !manual) {
          setBtnLoader(true);
          setShowSplash(true);
          formData.append("file", file);
          const response = await apiHelper.post("/vehicle/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          getVehicleData();
          setBtnLoader(false);
          setShowSplash(false);
          alert(response.message || "Upload successful");
        } else {
          setShowSplash(false);
          setBtnLoader(false);
          alert("Oops! Uploaded file was not in required format.");
        }
      } else if (manual) {
        setBtnLoader(true);
        setShowSplash(true);
        let body = {
          vehicleNo: vehicleNo,
          model: vehicleModel,
          from: vehicleFrom,
          status: "available",
          isDeleted: false,
        };
        const response = await apiHelper.post("/vehicle", body, {
          headers: { "Content-Type": "application/json" },
        });
        showModalform(false);
        setManual(false);
        setBtnLoader(false);
        setShowSplash(false);
        setvehicleNo("");
        setVehiclefrom("");
        setvehicleModel("");
        getVehicleData();
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  //  ***********************************Transaction APIs *******************************
  const getTransactionData = async () => {
    let response = await apiHelper.get("/transaction");
    setTransactionData(response.data);
    console.log("Data", response.data);
  };

  //******************************APIS ENDS******************************** */

  // ***************************Render modal forms***************************************
  const renderModalforma = () => {
    switch (value) {
      case 1:
        return (
          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <label htmlFor="empCode">Employee Code</label>
              <input
                type="text"
                className="form-control"
                id="empCode"
                name="empCode"
                value={empCode}
                onChange={handleInputChange}
                placeholder="Enter Employee code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="inputTwo">Employee Name</label>
              <input
                type="text"
                className="form-control"
                id="empName"
                name="empName"
                value={empName}
                onChange={handleInputChange}
                placeholder="Enter Employee name"
              />
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  showModalform(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  uploadEmployeeData(fileData);
                }}
                disabled={btnLoader}
              >
                {!btnLoader ? "Submit" : <ButtonLoader />}
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <label htmlFor="empCode">Vehicle No.</label>
              <input
                type="text"
                className="form-control"
                id="vehicleno"
                name="vehicleno"
                value={vehicleNo}
                onChange={handleInputChange}
                placeholder="Enter vehicle no."
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehiclemodal">Vehicle Model</label>
              <input
                type="text"
                className="form-control"
                id="vehicleModel"
                name="vehicleModel"
                value={vehicleModel}
                onChange={handleInputChange}
                placeholder="Enter vehicle model"
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehiclefrom">Vehicle From</label>
              <input
                type="text"
                className="form-control"
                id="vehicleFrom"
                name="vehicleFrom"
                value={vehicleFrom}
                onChange={handleInputChange}
                placeholder="Enter vehicle From"
              />
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  showModalform(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  uploadVehicleData(fileData);
                }}
                disabled={btnLoader}
              >
                {!btnLoader ? "Submit" : <ButtonLoader />}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <label htmlFor="empCode">Location Name</label>
              <input
                type="text"
                className="form-control"
                id="locName"
                name="locName"
                value={locationName}
                onChange={handleInputChange}
                placeholder="Enter cocation name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="inputTwo">Full address</label>
              <textarea
                className="form-control"
                id="fulladdress"
                name="fulladdress"
                value={locationFull}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows="3"
              ></textarea>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  showModalform(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                disabled={btnLoader}
                onClick={() => {
                  addLocationData();
                }}
              >
                {!btnLoader ? "Submit" : <ButtonLoader />}
              </Button>
            </div>
          </div>
        );
    }
  };

  const transactionAllocationForm = () => {
    return (
      <div>
        <p className="text-center">Add your documents here.</p>
        <div
          className="d-flex flex-column justify-content-center align-items-center border border-dashed rounded p-4"
          style={{
            height: "150px",
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
          }}
          onClick={handleFileUploadClick}
        >
          <div
            className="d-flex justify-content-center align-items-center p-3"
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50%",
              backgroundColor: "#e9ecef",
            }}
          >
            <i className="bi bi-upload" style={{ fontSize: "18px" }}></i>
          </div>
          <p className="text-muted mt-2">Upload your file here</p>
          <p className="text-muted" style={{ fontSize: "12px" }}>
            5MB max per file
          </p>
        </div>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={transactionFileInput}
          style={{ display: "none" }}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        <div>
          {count > 0 && totalAmount > 0 && (
            <div className="mt-3 text-center text-success">
              Provided file has <strong>{count}</strong> entries with a total
              amount of <strong>{totalAmount} AED</strong>. Kindly verify and
              submit.
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="d-flex gap-3">
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: themeColor }}
              onClick={() => {
                setTransactionModal(false);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: themeColor }}
              onClick={() => {
                uploadVehicleData(fileData);
              }}
              disabled={transactionBtn}
            >
              {"Submit"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.parent__container}>
        <div className="d-flex justify-content-end align-items-center gap-2">
          <div className="d-flex   justify-content-end align-items-end mb-2 gap-2">
            {value === 0 && (
              <button
                type="button"
                className="btn btn-primary mt-2 btn-sm d-flex justify-content-center align-items-center gap-2"
                style={{
                  backgroundColor: "#9acb3b",
                  border: "none",
                  borderRadius: "1.5rem",
                  fontWeight: "bold",
                }}
                onClick={handleButtonClick}
              >
                Bulk Import{" "}
                <i
                  className="bi bi-cloud-arrow-up"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                ></i>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </button>
            )}
            {value !== 0 && (
              <div>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleClick}
                  sx={{
                    backgroundColor: "#9acb3b",
                    borderRadius: "1.5rem",
                    fontSize: ".95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    height: "40px",
                    fontWeight: "bold",
                  }}
                >
                  Add
                  <i
                    className="bi bi-plus-circle"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  ></i>
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {value !== 3 && (
                    <MenuItem onClick={handleButtonClick}>
                      Excel import
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      showModalform(true);
                      setManual(true);
                      setFileData(null);
                      setFileName("");
                      handleClose();
                    }}
                  >
                    Add manually
                  </MenuItem>
                </Menu>
              </div>
            )}

            <div className="d-flex  gap-2 justify-content-end align-items-end">
              {
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-sm d-flex justify-content-center align-items-center gap-2"
                  style={{
                    backgroundColor: "#9acb3b",
                    border: "none",
                    borderRadius: "1.5rem",
                    fontWeight: "bold",
                  }}
                  onClick={() => {}}
                >
                  Excel Export{" "}
                  <i
                    className="bi bi-download"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  ></i>
                </button>
              }
              {value === 2 && (
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-sm d-flex justify-content-center align-items-center gap-2"
                  style={{
                    backgroundColor: "#9acb3b",
                    border: "none",
                    borderRadius: "1.5rem",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    setTransactionModal(true);
                  }}
                >
                  Transaction Allocation{" "}
                  <i
                    className="bi bi-arrow-left-right"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  ></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Selected File for import Data */}
        {fileName && (
          <div className="d-flex align-items-center gap-5">
            <p style={{ marginTop: "10px", color: "#333" }}>
              Selected file: <strong>{fileName}</strong>
            </p>
            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center gap-2"
              style={{
                backgroundColor: "#9acb3b",
                border: "none",
                borderRadius: "1.5rem",
                fontWeight: "bold",
                width: "150px",
                height: "30px",
              }}
              onClick={() => {
                uploadEmployeeData(fileData);
              }}
            >
              Submit
            </button>
          </div>
        )}
        <div className={styles.header__tab}>
          <div
            className={
              value === 0 ? styles.filter__container : styles.without__filters
            }
          >
            <div className="mb-3 w-100">
              {/* Search Input Field */}
              <label htmlFor="endDate" className="form-label">
                Search...
              </label>
              <input
                type="text"
                className="form-control"
                id="startDate"
                placeholder="Search..."
              />
            </div>

            {/* Start Date Picker */}
            {value === 0 && (
              <>
                <div className="mb-3 w-100">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control w-100"
                    id="startDate"
                  />
                </div>
                {/* End Date Picker */}
                <div className="mb-3 w-100">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="form-control w-100"
                    id="endDate"
                  />
                </div>
                {/* Select Input for Checin and checkout */}
                <div className="mb-3 w-100">
                  <label htmlFor="availability" className="form-label">
                    Status Filter
                  </label>
                  <select className="form-select w-100" id="availability">
                    <option value="available">Check in</option>
                    <option value="notAvailable">Check out</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.tabs}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <ThemeProvider theme={theme}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="Transactions" color="#9acb3b" {...a11yProps(0)} />
                <Tab label="Drivers" {...a11yProps(1)} />
                <Tab label="Vehicles" {...a11yProps(2)} />
                <Tab label="Locations" {...a11yProps(3)} />
                <Tab label="Reports" {...a11yProps(5)} />
              </Tabs>
            </ThemeProvider>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="transaction table">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Vehicle Number</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Images</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionData?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row?.employee?.code}</TableCell>
                      <TableCell>{row?.employee?.name}</TableCell>
                      <TableCell>{row?.vehicle?.vehicleNo}</TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell align="center">{row.time}</TableCell>
                      <TableCell align="center">
                        {row?.location?.name}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            row.action === "entry" ? "Check in" : "Check out"
                          }
                          color={row.action === "entry" ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <i
                          className="bi bi-eye cursor-pointer"
                          onClick={() => {
                            handleImageClick(row.pictures);
                            console.log("Click", row.pictures);
                          }}
                        ></i>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sr no.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Employee Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData
                    ? employeeData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.code}</TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                        </TableRow>
                      ))
                    : "No Data Available"}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sr no.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Vehicle No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Owned By</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Emirates</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Aggregator
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Chasis No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Chasis No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Availability Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData.length > 0
                    ? vehicleData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.vehicleNo}</TableCell>
                          <TableCell align="left">
                            {row?.model?.brand}
                          </TableCell>
                          <TableCell align="left">
                            {row?.ownedBy?.name}
                          </TableCell>
                          <TableCell align="left">{row?.emirates}</TableCell>
                          <TableCell align="left">{`${row?.vehicleType?.name} ${row?.vehicleType?.fuel}`}</TableCell>
                          <TableCell align="left">
                            {row?.aggregator?.name}
                          </TableCell>
                          <TableCell align="left">
                            {row?.chasisNumber}
                          </TableCell>
                          <TableCell align="left">
                            {row?.registrationExpiry}
                          </TableCell>

                          <TableCell align="left">
                            <Chip
                              label={
                                row?.status === "available"
                                  ? "available"
                                  : "occupied"
                              }
                              color={
                                row?.status === "available"
                                  ? "success"
                                  : "error"
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    : "No Data Available"}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sr no.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Location Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Full Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationData
                    ? locationData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell align="left">{row?.fullAddress}</TableCell>
                        </TableRow>
                      ))
                    : "No Data Available"}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
        </div>
      </div>
      <Modal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {["back", "front", "left", "right"].map((position) => {
            const imageObj = selectedImages?.find((img) => img.value[position]);
            console.log("obj", imageObj);
            const urlid =
              imageObj && imageObj?.value[position]?.url
                ? extractGoogleDriveFileId(imageObj?.value[position]?.url)
                : null;
            console.log("UR:", urlid);
            return (
              <img
                src={
                  urlid
                    ? `https://lh3.googleusercontent.com/d/${urlid}=w1000?authuser=1/view`
                    : placeholder
                }
                alt={position}
                onClick={() => urlid && handleFullImageClick(urlid)}
                style={{
                  cursor: "pointer",
                  width: "150px",
                  height: "auto",
                  margin: ".25rem",
                }}
              />
            );
          })}
        </Box>
      </Modal>
      {/* Modal for full image view */}
      <Modal
        open={showFullImageModal}
        onClose={() => setShowFullImageModal(false)}
      >
        <Box sx={style2}>
          <img
            src={`https://lh3.googleusercontent.com/d/${fullImage}=w1000?authuser=1/view`}
            alt="full-img"
            style={{
              width: "500px",
              height: "500px",
            }}
          />
        </Box>
      </Modal>
      {/* Modal For Forms */}
      <Modal open={modalForm}>
        <Box sx={style}>{renderModalforma()}</Box>
      </Modal>

      {/* Modal For Transaction Allocation */}
      <Modal open={transactionModal} onClose={() => setTransactionModal(false)}>
        <Box sx={style}>{transactionAllocationForm()}</Box>
      </Modal>
      {/* Splash Loader */}
      {showSplash && <Splashscreen />}

      {showFileLoader && <FileLoader />}

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

export default Dashboard;
