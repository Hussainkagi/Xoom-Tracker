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

import ButtonLoader from "../../components/Loader/buttonLoader";
import Splashscreen from "../../components/Splashscreen/splashloader";

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

  const [anchorEl, setAnchorEl] = useState(null);

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

  // ************************* Fetch All Data**********************'
  const fetchAllData = async () => {
    setShowSplash(true);
    try {
      const [transactionRes, vehicleRes, locationRes, employeeRes] =
        await Promise.all([
          apiHelper.get("/transaction"),
          apiHelper.get("/vehicle"),
          apiHelper.get("/location"),
          apiHelper.get("/employee"),
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
                  onClick={() => {}}
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
                <Tab label="Add Subfields" {...a11yProps(4)} />
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
                    <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Availability Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData
                    ? vehicleData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.vehicleNo}</TableCell>
                          <TableCell align="left">{row?.model}</TableCell>
                          <TableCell align="left">{row?.from}</TableCell>
                          <TableCell align="left">
                            <Chip
                              label={
                                row?.status === "occupied"
                                  ? "available"
                                  : "occupied"
                              }
                              color={
                                row?.status === "occupied" ? "success" : "error"
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
          <CustomTabPanel value={value} index={4}>
            <div className="row">
              <div className="col-md-6">
                <div className="accordion mb-2" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Add Aggregator
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                    >
                      <div className="accordion-body">
                        {/* Add Button */}
                        <div className="mb-3">
                          <button
                            className="btn text-white"
                            style={{ backgroundColor: "#9acb3b" }}
                          >
                            Add
                          </button>
                        </div>
                        {/* Table */}
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Amazon</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Noon</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {/* ****************Add Vehicle Type**************** */}
                <div className="accordion mb-2" id="accordionExample2">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="true"
                        aria-controls="collapseTwo"
                      >
                        Add Category
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingTwo"
                    >
                      <div className="accordion-body">
                        {/* Add Button */}
                        <div className="mb-3">
                          <button
                            className="btn text-white"
                            style={{ backgroundColor: "#9acb3b" }}
                          >
                            Add
                          </button>
                        </div>
                        {/* Table */}
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Type</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Bike Electronic</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Car Petrol</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="accordion mb-2" id="accordionExample3">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="true"
                        aria-controls="collapseThree"
                      >
                        Add Emirates
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingThree"
                    >
                      <div className="accordion-body">
                        {/* Add Button */}
                        <div className="mb-3">
                          <button
                            className="btn text-white"
                            style={{ backgroundColor: "#9acb3b" }}
                            onClick={() => {
                              alert("Bhaggg reeee!!!");
                            }}
                          >
                            Add
                          </button>
                        </div>
                        {/* Table */}
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Dubai</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Ajman</td>
                              <td>
                                <div className={styles.btn_box}>
                                  <i
                                    className="bi bi-trash"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      <Modal open={modalForm} onClose={() => setShowFullImageModal(false)}>
        <Box sx={style}>{renderModalforma()}</Box>
      </Modal>
      {/* Splash Loader */}
      {showSplash && <Splashscreen />}
    </div>
  );
};

export default Dashboard;
