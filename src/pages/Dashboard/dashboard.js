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
import { Modal } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import apiHelper from "../../utils/apiHelper/apiHelper";

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

  // Table Data States
  const [employeeData, setEmployeeData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [fullImage, setFullImage] = useState("");

  const placeholderImage = "https://via.placeholder.com/150";

  useEffect(() => {
    getTransactionData();
    getEmployeeData();
    getLocationData();
    getVehicleData();
  }, []);

  // Handle the button click to trigger the file input
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Process the file as needed
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
  //  ***********************************Employee APIs *******************************
  const getEmployeeData = async () => {
    let response = await apiHelper.get("/employee");

    setEmployeeData(response.data);
  };

  //  ***********************************Location APIs *******************************
  const getLocationData = async () => {
    let response = await apiHelper.get("/location");
    setLocationData(response.data);
  };

  //  ***********************************Vehicle APIs *******************************
  const getVehicleData = async () => {
    let response = await apiHelper.get("/vehicle");
    setVehicleData(response.data);
  };

  //  ***********************************Transaction APIs *******************************
  const getTransactionData = async () => {
    let response = await apiHelper.get("/transaction");
    setTransactionData(response.data);
    console.log("Data", response.data);
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.parent__container}>
        <div className="d-flex  flex-column justify-content-end align-items-end mb-2">
          {value === 0 && (
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
              onClick={handleButtonClick}
            >
              Bulk Import{" "}
              <i
                className="bi bi-cloud-arrow-down"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              ></i>
            </button>
          )}
          <div className="btn-group" role="group">
            <button
              id="btnGroupDrop1"
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Add
            </button>
            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a className="dropdown-item" href="#">
                Dropdown link
              </a>
              <a className="dropdown-item" href="#">
                Dropdown link
              </a>
            </div>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {fileName && (
            <p style={{ marginTop: "10px", color: "#333" }}>
              Selected file: <strong>{fileName}</strong>
            </p>
          )}
        </div>
        <div className="d-flex  flex-column justify-content-end align-items-end">
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-primary btn-sm d-flex justify-content-center align-items-center gap-2"
            style={{
              backgroundColor: "#9acb3b",
              border: "none",
              fontWeight: "bold",
              borderRadius: "1.5rem",
            }}
            onClick={() => {}}
          >
            Export Excel{" "}
            <i
              className="bi bi-cloud-arrow-up"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            ></i>
          </button>
        </div>
        <div className={styles.header__tab}>
          <div className={styles.filter__container}>
            {/* Start Date Picker */}
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
              <input type="date" className="form-control w-100" id="endDate" />
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

            <div className="mb-3 w-100">
              {/* Search Input Field */}
              <label htmlFor="endDate" className="form-label">
                Search...
              </label>
              <input
                type="text"
                className="form-control w-100"
                id="startDate"
                placeholder="Search..."
              />
            </div>
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
                  {transactionData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.empCode}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.vehicleNum}</TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell align="center">{row.time}</TableCell>
                      <TableCell align="center">{row.location}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.status}
                          color={
                            row.status === "Check In" ? "success" : "error"
                          }
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
                          <TableCell align="left">{row?.status}</TableCell>
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
            const imageObj = selectedImages.find((img) => img.value[position]);
            console.log("obj", imageObj);
            const urlid =
              imageObj && imageObj.value[position].url
                ? extractGoogleDriveFileId(imageObj.value[position].url)
                : null;
            console.log("UR:", urlid);
            return (
              <img
                src={
                  urlid
                    ? `https://lh3.googleusercontent.com/d/${urlid}=w1000?authuser=1/view`
                    : placeholderImage
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
    </div>
  );
};

export default Dashboard;
