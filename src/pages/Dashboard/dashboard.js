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
import Tooltip from "@mui/material/Tooltip";
import { Modal, Button, Menu, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import apiHelper from "../../utils/apiHelper/apiHelper";
import placeholder from "../../assets/Images/noimage.jpg";
import * as XLSX from "xlsx";
import ButtonLoader from "../../components/Loader/buttonLoader";
import Splashscreen from "../../components/Splashscreen/splashloader";

import FileLoader from "../../components/FileUploadLoader/loader";
import Toast from "../../components/Toast/toast";
import { EditLocation } from "@mui/icons-material";
import alrtSign from "../../assets/Images/alert.png";

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
  maxHeight: "90vh",
  overflow: "hidden",
};

const scrollableStyle = {
  maxHeight: "70vh",
  overflowY: "auto",
  paddingRight: "8px",
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
  const [empId, setEmpId] = useState("");

  // Locstion form states
  const [locationName, setLocationName] = useState("");
  const [locationFull, setLocationfull] = useState("");
  const [locId, setLocId] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);

  //Transaction Allocation Flow States
  const [TafileData, setTaFileData] = useState(null);
  const [count, setCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactionBtn, setTransactionBtn] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [date, setDate] = useState("");
  const [apiData, setApiData] = useState({
    aggregators: [],
    categories: [],
    ownedBy: [],
    models: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    status: "",
    filterData: [],
    vehicleData: [],
    employeeData: [],
  });
  const [vehicleInputs, setVehicleInputs] = useState({
    aggregator: "",
    vehicleType: "",
    ownedby: "",
    model: "",
    expDate: "",
    emirates: "",
    vehicleNo: "",
    chasisNo: "",
    code: "",
    isEditing: false,
    editId: "",
  });
  const Emirates = [
    "AbuDhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Fujairah",
    "RasAlKhaimah",
    "UmmAlQuwain",
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApiData = (key, value) => {
    setApiData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleInputFields = (key, value) => {
    setVehicleInputs((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Function to update filter values
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    setDate(inputDate);
    console.log("date", e.target.value);
    if (inputDate) {
      const [year, month, day] = inputDate.split("-");
      handleInputFields("expDate", `${day}-${month}-${year}`);
    } else {
      handleInputFields("expDate", "");
    }
  };

  const handleDeleteClick = (id) => {
    setShowDeletePopup(true);

    switch (value) {
      case 1:
        setEmpId(id);
      case 2:
        handleInputFields("editId", id);
      case 3:
        setLocId(id);
      default:
        return;
    }
  };

  const applyFilters = () => {
    switch (value) {
      case 0:
        // Case 0: Apply all filters (search, dates, and status)

        // const filteredData = transactionData.filter((row) => {
        //   console.log("Kamal", row);
        //   const matchesSearch =
        //     !filters.search ||
        //     row.employee?.code
        //       .toLowerCase()
        //       .includes(filters.search.toLowerCase());
        //   //   ||
        //   // row.vehicle.vehicleNo.includes(filters.search);

        //   console.log("Kamal", filters.search);
        //   console.log("Kamalss", matchesSearch);

        //   const matchesDate =
        //     (!filters.startDate ||
        //       new Date(row.date) >= new Date(filters.startDate)) &&
        //     (!filters.endDate ||
        //       new Date(row.date) <= new Date(filters.endDate));

        //   // const matchesStatus =
        //   //   !filters.status ||
        //   //   (filters.status === "available" && row.action === "in") ||
        //   //   (filters.status === "notAvailable" && row.action === "out");

        //   return matchesSearch;
        //   // && matchesDate && matchesStatus;
        // });
        // handleFilterChange("filterData", filteredData);
        applyFiltersUpdated();
        break;
    }
  };

  const applyFiltersUpdated = () => {
    let filteredData = transactionData.filter((row) => {
      // Ignore rows with null or undefined critical fields
      // if (!row?.employee?.code || !row?.date || !row?.vehicle?.vehicleNo) {
      //   return false;
      // }

      const matchesSearch =
        !filters.search ||
        (row.employee?.code &&
          row.employee.code
            .toLowerCase()
            .includes(filters.search.toLowerCase())) ||
        (row.employee?.name &&
          row.employee.name
            .toLowerCase()
            .includes(filters.search.toLowerCase()));

      const matchesDate =
        (!filters.startDate ||
          new Date(row.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(row.date) <= new Date(filters.endDate));

      console.log("staus", filters?.status);
      const matchesStatus =
        !filters.status ||
        (filters.status === "in" && row.action === "in") ||
        (filters.status === "out" && row.action === "out");

      return matchesSearch && matchesDate && matchesStatus;
    });

    // Update the filterData with the new filtered data
    handleFilterChange("filterData", filteredData);
  };

  const searchOnVehicles = () => {
    const filteredVehicleData = vehicleData?.filter((row) => {
      const vehicleNoMatch = row?.vehicleNo
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());
      const aggregatorMatch = row?.aggregator?.name
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());
      return vehicleNoMatch || aggregatorMatch;
    });

    handleFilterChange("vehicleData", filteredVehicleData);
  };

  // Filter employee data based on search query
  const searchOnEmployess = () => {
    const filteredEmployeeData = employeeData?.filter((row) => {
      const nameMatch = row?.name
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());
      const codeMatch = row?.code
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());
      return nameMatch || codeMatch;
    });

    handleFilterChange("employeeData", filteredEmployeeData);
  };

  const showApplyButton =
    filters.search || (filters.startDate && filters.endDate) || filters.status;

  // Handle the button click to trigger the file input
  const handleButtonClick = () => {
    setFileData(null);
    fileInputRef.current.click();
    setAnchorEl(false);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    console.log("dsjhdjs");
    const file = event?.target?.files[0];
    if (file) {
      setFileName(file.name);
      setFileData(file);
      // Process the file as needed
    }
  };
  const formatDate = (date) => {
    if (date) {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  const editLocationModal = (data) => {
    showModalform(true);
    setLocationName(data?.name);
    setLocationfull(data?.fullAddress);
    setLocId(data?.id);
    handleInputFields("isEditing", true);
  };

  const editEmployeemodal = (data) => {
    showModalform(true);
    setEmpId(data?.id);
    setEmpCode(data?.code);
    setEmpName(data?.name);
    handleInputFields("isEditing", true);
  };

  const editVehicleModal = (data) => {
    showModalform(true);
    handleInputFields("isEditing", true);
    handleInputFields("aggregator", data?.aggregator?.id);
    handleInputFields("vehicleType", data?.vehicleType?.id);
    handleInputFields("ownedby", data?.ownedBy?.id);
    handleInputFields("model", data?.model?.id);
    handleInputFields("emirates", data?.emirates);

    handleInputFields("vehicleNo", data?.vehicleNo);
    handleInputFields("chasisNo", data?.chasisNumber);
    handleInputFields("code", data?.code);
    const formattedExpiryDate = formatDate(data?.registrationExpiry);
    setDate(formattedExpiryDate);
    handleInputFields("expDate", formattedExpiryDate);
    handleInputFields("editId", data?.id);
  };

  const clearFields = () => {
    handleInputFields("isEditing", false);
    handleInputFields("aggregator", "");
    handleInputFields("vehicleType", "");
    handleInputFields("ownedby", "");
    handleInputFields("model", "");
    handleInputFields("emirates", "");
    handleInputFields("expDate", "");
    handleInputFields("vehicleNo", "");
    handleInputFields("chasisNo", "");
    handleInputFields("code", "");
    setEmpCode("");
    setEmpName("");
    setLocationName("");
    setLocationfull("");
  };

  const checkVehicleFields = () => {
    if (
      !vehicleInputs.vehicleType ||
      !vehicleInputs.ownedby ||
      !vehicleInputs.model ||
      !vehicleInputs.emirates ||
      !vehicleInputs.vehicleNo ||
      !vehicleInputs.chasisNo ||
      !vehicleInputs.code ||
      !vehicleInputs.expDate
    ) {
      showToast("error", "Error", "All fields are required");
      return false;
    }
    return true;
  };

  const handleCloseToast = () => {
    setToastConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };
  const showToast = (type, title, subtitle) => {
    setToastConfig({
      show: true,
      title,
      subtitle,
      type,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "aggregators") handleInputFields("aggregator", value);
    if (name === "categories") handleInputFields("vehicleType", value);
    if (name === "ownedBy") handleInputFields("ownedby", value);
    if (name === "models") handleInputFields("model", value);
    if (name === "emirates") handleInputFields("emirates", value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleFilterChange("search", "");
    handleFileChange("startDate", "");
    handleFileChange("endDate", "");
    handleFileChange("status", "");
    handleFileChange("filterData", []);
  };

  const handleInputChange = (e) => {
    const { name } = e.target;

    switch (value) {
      case 1:
        if (name === "empCode") setEmpCode(e.target.value);
        if (name === "empName") setEmpName(e.target.value);

      case 2:
        if (name === "vehicleno")
          handleInputFields("vehicleNo", e.target.value);
        if (name === "chasisNo") handleInputFields("chasisNo", e.target.value);
        if (name === "vehicleCode") handleInputFields("code", e.target.value);

      case 3:
        if (name === "locName") setLocationName(e.target.value);
        if (name === "fulladdress") setLocationfull(e.target.value);
    }
  };

  const submitFile = () => {
    switch (value) {
      case 0:
        //Transaction Upload
        uploadTransactionData(fileData);
        break;

      case 1:
        // Driver allocation
        uploadEmployeeData(fileData);

        break;
      case 2:
        uploadVehicleData(fileData);
        // Vehicle allocation
        break;
      case 3:
        // Transaction allocation
        break;
      default:
        return;
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
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet is the one with data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process the data to count rows and calculate total amount
        if (sheetData?.length > 1) {
          const rows = sheetData.slice(1); // Skip header
          const amountIndex = sheetData[0].indexOf("amount"); // Find "amount" column index

          if (amountIndex !== -1) {
            const total = rows.reduce(
              (sum, row) => sum + (parseFloat(row[amountIndex]) || 0),
              0
            );
            setCount(rows?.length);
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
      const [
        transactionRes,
        vehicleRes,
        locationRes,
        employeeRes,
        aggregator,
        ownedBy,
        model,
        vehicleType,
      ] = await Promise.all([
        apiHelper.get("/transaction", {}, headers),
        apiHelper.get("/vehicle", {}, headers),
        apiHelper.get("/location", {}, headers),
        apiHelper.get("/employee", {}, headers),
        apiHelper.get("/aggregator", {}, headers),
        apiHelper.get("/owned-by", {}, headers),
        apiHelper.get("/model", {}, headers),
        apiHelper.get("/vehicle-type", {}, headers),
      ]);

      setTransactionData(transactionRes.data);
      handleFilterChange("filterData", transactionRes.data);
      setVehicleData(vehicleRes.data);
      setLocationData(locationRes.data);
      setEmployeeData(employeeRes.data);
      handleApiData("aggregators", aggregator?.data);
      handleApiData("ownedBy", ownedBy?.data);
      handleApiData("models", model?.data);
      handleApiData("categories", vehicleType?.data);
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const downloadErrorFile = (data) => {
    const errorData = data.errorArray.map((error, index) => ({
      "#": index + 1,
      Error: error,
    }));
    const worksheet = XLSX.utils.json_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ErrorReport.xlsx";
    link.click();
    setPopupVisible(true);
  };

  //  ***********************************Employee APIs *******************************
  const getEmployeeData = async () => {
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let response = await apiHelper.get("/employee", {}, headers);
    setEmployeeData(response.data);
  };

  const uploadEmployeeData = async (file) => {
    try {
      if (!file) {
        alert("No file selected. Please upload a file.");
        return;
      }

      if (file) {
        const isExcelFile =
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        // console.log("is Excel file", isExcelFile);
        // console.log("file", file);

        if (isExcelFile && !manual) {
          let authToken = localStorage.getItem("token");
          let headers = {
            Authorization: "Bearer " + authToken,
          };
          setBtnLoader(true);
          // setShowSplash(true);
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            process.env.REACT_APP_BASE_URL + "/employee/upload",
            {
              method: "POST",
              headers,
              body: formData,
            }
          );

          const result = await response.json();

          if (result?.success) {
            setTimeout(() => {
              getEmployeeData();
              setBtnLoader(false);
              setFileData(null);
              setFileName("");
              fileInputRef.current.value = "";
              showToast("success", "Success", "Driver upload successfully!");
              if (result?.errorArray?.length > 0) {
                downloadErrorFile(result);
              }
            }, 1500);
          } else {
            setBtnLoader(false);

            setFileData(null);
            setFileName("");
            fileInputRef.current.value = "";
            showToast(
              "error",
              "Error",
              result.message || "Something went wrong!"
            );
          }
        } else {
          setBtnLoader(false);
          setFileData(null);
          setFileName("");
          fileInputRef.current.value = "";
          alert("Oops! Uploaded file was not in required format.");
        }
      } else if (manual) {
        if (!empCode || !empName) {
          showToast("error", "Error", "All fields are required");
          return;
        }
        setBtnLoader(true);
        let authToken = localStorage.getItem("token");
        let headers = {
          Authorization: "Bearer " + authToken,
        };
        let body = {
          code: empCode.toUpperCase(),
          name: empName,
          status: "active",
          isDeleted: false,
        };

        const response = await apiHelper.post("/employee", body, headers);
        if (response.success) {
          setTimeout(() => {
            showModalform(false);
            setManual(false);
            setBtnLoader(false);
            showToast("success", "Success", "Driver created successfully!");
            setEmpCode("");
            setEmpName("");
            getEmployeeData();
          }, 800);
        } else {
          showToast("error", "Error", response.message);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  const updateEmployee = async () => {
    if (!empCode || !empName) {
      showToast("error", "Error", "All fields are required");
      return;
    }
    handleInputFields("isEditing", true);
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let body = {
      code: empCode.toUpperCase(),
      name: empName,
      status: "active",
      isDeleted: false,
    };

    try {
      let response = await apiHelper.patch(`/employee/${empId}`, body, headers);
      if (response?.success) {
        setTimeout(() => {
          showModalform(false);
          setBtnLoader(false);
          clearFields();
          handleInputFields("isEditing", false);
          getEmployeeData();
          showToast("success", "Success", "Driver data updated successfully!");
        }, 800);
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      alert("something went wrong");
      setBtnLoader(false);
    }
  };

  const deleteEmployee = async (id) => {
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let response = await apiHelper.del(`employee/${id}`, headers, {});
      if (response.success) {
        setTimeout(() => {
          getEmployeeData();
          setBtnLoader(false);
          setShowDeletePopup(false);
          showToast("success", "Success", "Driver data deleted successfully!");
        }, 800);
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      setBtnLoader(false);
    }
  };

  //  ***********************************Location APIs *******************************
  const getLocationData = async () => {
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let response = await apiHelper.get("/location", {}, headers);
    setLocationData(response.data);
  };

  const addLocationData = async () => {
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let body = {
        name: locationName,
        fullAddress: locationFull,
      };
      const response = await apiHelper.post("/location", body, headers);
      if (response?.success) {
        setTimeout(() => {
          showModalform(false);
          setManual(false);
          setLocationName("");
          setLocationfull("");
          getLocationData();
          setBtnLoader(false);
        }, 800);

        showToast("success", "Success", "Vehicle created successfully!");
      } else {
        showToast("error", "Error", response.message);
      }
    } catch (error) {
      alert("Failed to add location.");
      setBtnLoader(false);
    }
  };

  const updateLocationData = async () => {
    if (!locationName || !locationFull) {
      showToast("error", "Error", "All fields are required");
      return;
    }
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let body = {
      name: locationName,
      fullAddress: locationFull,
    };
    try {
      let response = await apiHelper.patch(`/location/${locId}`, body, headers);
      if (response?.success) {
        setTimeout(() => {
          handleInputFields("isEditing", false);
          showModalform(false);
          setLocationName("");
          setLocationfull("");
          getLocationData();
          setBtnLoader(false);
        }, 800);

        showToast("success", "Success", "Location updated successfully!");
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      alert("something went wrong");
      setBtnLoader(false);
    }
  };

  const deleteLocation = async (id) => {
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let response = await apiHelper.del(`location/${id}`, headers, {});
      if (response.success) {
        setTimeout(() => {
          getLocationData();
          setBtnLoader(false);
          setShowDeletePopup(false);
          showToast(
            "success",
            "Success",
            "Location data deleted successfully!"
          );
        }, 800);
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      setBtnLoader(false);
      alert("something went wrong!");
    }
  };

  //  ***********************************Vehicle APIs *******************************
  const getVehicleData = async () => {
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let response = await apiHelper.get("/vehicle", {}, headers);
    setVehicleData(response.data);
  };

  const uploadVehicleData = async (file) => {
    try {
      const formData = new FormData();
      // formData.append("file", file);+
      if (file) {
        let authToken = localStorage.getItem("token");
        let headers = {
          Authorization: "Bearer " + authToken,
        };
        const isExcelFile =
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        if (isExcelFile && !manual) {
          setBtnLoader(true);
          const formData = new FormData();
          formData.append("file", file);
          console.log("Form", formData);
          const response = await fetch(
            process.env.REACT_APP_BASE_URL + "/vehicle/upload",
            {
              method: "POST",
              headers,
              body: formData,
            }
          );
          const result = await response.json();
          if (result?.success) {
            setTimeout(() => {
              setFileData(null);
              setFileName("");
              fileInputRef.current.value = "";
              getVehicleData();
              setBtnLoader(false);
              showToast("success", "Success", "Driver upload successfully!");
              if (result?.errorArray?.length > 0) {
                downloadErrorFile(result);
              }
            }, 1500);
          } else {
            setBtnLoader(false);

            setFileData(null);
            setFileName("");
            fileInputRef.current.value = "";
            showToast(
              "error",
              "Error",
              result.message || "Something went wrong!"
            );
          }
        } else {
          setBtnLoader(false);
          alert("Oops! Uploaded file was not in required format.");
        }
      } else if (manual) {
        if (!checkVehicleFields()) {
          return;
        }
        setBtnLoader(true);
        let authToken = localStorage.getItem("token");
        let headers = {
          Authorization: "Bearer " + authToken,
        };
        let body = {
          vehicleNo: vehicleInputs?.vehicleNo,
          code: vehicleInputs?.code,
          modelId: vehicleInputs?.model,
          vehicleTypeId: vehicleInputs?.vehicleType,
          ownedById: vehicleInputs?.ownedby,
          aggregatorId: vehicleInputs?.aggregator,
          registrationExpiry: vehicleInputs?.expDate,
          emirates: vehicleInputs?.emirates,
          chasisNumber: vehicleInputs?.chasisNo,
          status: "available",
          isDeleted: false,
        };

        try {
          const response = await apiHelper.post("/vehicle", body, headers);
          if (response?.success) {
            setTimeout(() => {
              showModalform(false);
              setManual(false);
              setBtnLoader(false);
              clearFields();

              getVehicleData();
            }, 800);

            showToast("success", "Success", "Vehicle created successfully!");
          } else {
            showToast("error", "Error", response.message);
          }
        } catch (err) {
          alert("something went wrong");
          setBtnLoader(false);
        }
      }
    } catch (error) {
      alert("Failed to upload file.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  const updateVehicle = async () => {
    let body1 = {
      vehicleNo: vehicleInputs?.vehicleNo,
      code: vehicleInputs?.code,
      modelId: vehicleInputs?.model,
      vehicleTypeId: vehicleInputs?.vehicleType,
      ownedById: vehicleInputs?.ownedby,
      aggregatorId: vehicleInputs?.aggregator,
      registrationExpiry: vehicleInputs?.expDate,
      emirates: vehicleInputs?.emirates,
      chasisNumber: vehicleInputs?.chasisNo,
      status: "available",
      isDeleted: false,
    };

    console.log("update", body1);
    if (!checkVehicleFields()) {
      return;
    }
    setBtnLoader(true);
    setShowSplash(false);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let body = {
      vehicleNo: vehicleInputs?.vehicleNo,
      code: vehicleInputs?.code,
      modelId: vehicleInputs?.model,
      vehicleTypeId: vehicleInputs?.vehicleType,
      ownedById: vehicleInputs?.ownedby,
      aggregatorId: vehicleInputs?.aggregator,
      registrationExpiry: vehicleInputs?.expDate,
      emirates: vehicleInputs?.emirates,
      chasisNumber: vehicleInputs?.chasisNo,
      status: "available",
      isDeleted: false,
    };
    try {
      let response = await apiHelper.patch(
        `/vehicle/${vehicleInputs?.editId}`,
        body,
        headers
      );
      if (response?.success) {
        setTimeout(() => {
          showModalform(false);
          setBtnLoader(false);
          clearFields();
          handleInputFields("isEditing", false);
          getVehicleData();
        }, 800);

        showToast("success", "Success", "Vehicle updated successfully!");
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      alert("something went wrong");
      setBtnLoader(false);
    }
  };

  const deleteVehicle = async (id) => {
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let response = await apiHelper.del(`vehicle/${id}`, headers, {});
      if (response.success) {
        setTimeout(() => {
          getVehicleData();
          setBtnLoader(false);
          setShowDeletePopup(false);
          showToast("success", "Success", "Vehicle deleted successfully!");
          handleInputFields("editId", "");
        }, 800);
      } else {
        showToast("error", "Error", response.message);
        setBtnLoader(false);
      }
    } catch (err) {
      setBtnLoader(false);
    }
  };

  //  ***********************************Transaction APIs *******************************
  const getTransactionData = async () => {
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    let response = await apiHelper.get("/transaction", {}, headers);
    setTransactionData(response.data);
    handleFilterChange("filterData", response.data);
    console.log("Data", response.data);
  };

  const uploadTransactionData = async (file) => {
    try {
      if (!file) {
        alert("No file selected. Please upload a file.");
        return;
      }

      if (file) {
        const isExcelFile =
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        // console.log("is Excel file", isExcelFile);
        // console.log("file", file);

        if (isExcelFile) {
          let authToken = localStorage.getItem("token");
          let headers = {
            Authorization: "Bearer " + authToken,
          };
          setBtnLoader(true);
          // setShowSplash(true);
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            process.env.REACT_APP_BASE_URL + "/transaction/upload",
            {
              method: "POST",
              headers,
              body: formData,
            }
          );

          const result = await response.json();

          if (result?.success) {
            setTimeout(() => {
              getTransactionData();
              setBtnLoader(false);
              setFileData(null);
              setFileName("");
              fileInputRef.current.value = "";
              showToast(
                "success",
                "Success",
                "Transaction upload successfully!"
              );
              if (result?.errorArray?.length > 0) {
                downloadErrorFile(result);
              }
            }, 1500);
          } else {
            setBtnLoader(false);

            setFileData(null);
            fileInputRef.current.value = "";
            setFileName("");
            showToast(
              "error",
              "Error",
              result.message || "Something went wrong!"
            );
          }
        } else {
          setBtnLoader(false);
          setFileData(null);
          setFileName("");
          fileInputRef.current.value = "";
          alert("Oops! Uploaded file was not in required format.");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file.");
      setBtnLoader(false);
      setShowSplash(false);
    }
  };

  //******************************APIS ENDS******************************** */

  const deleteFunction = () => {
    switch (value) {
      case 1:
        return deleteEmployee(empId);
      case 2:
        return deleteVehicle(vehicleInputs?.editId);
      case 3:
        return deleteLocation(locId);
      default:
        return;
    }
  };

  // ****************************Export Data to Excel Common Function*******************************
  const exportDataToExcel = () => {
    switch (value) {
      case 1: // Employee Data
        // Prepare the data for Excel
        console.log("AA", employeeData);
        const employeeSheetData = employeeData.map((item, index) => ({
          "Sr. No.": index + 1,
          "Employee Code": item.code,
          "Driver Name": item.name,
        }));

        console.log("sheete", employeeSheetData);

        // Convert the data to a worksheet
        const employeeSheet = XLSX.utils.json_to_sheet(employeeSheetData);

        // Create a workbook and append the sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, employeeSheet, "Employees");

        // Export the Excel file
        XLSX.writeFile(workbook, "Employee_Data.xlsx");
        break;

      case 2: // Vehicle Data
        const vehicleSheetData = vehicleData.map((item, index) => ({
          "Sr. No.": index + 1,
          Code: item.code,
          "Vehicle No": item.vehicleNo,
          "Registration Expiry": item.registrationExpiry,
          Emirates: item.emirates,
          "Chassis Number": item.chasisNumber,
          Status: item.status,
          "Vehicle Type": item.vehicleType?.name || "N/A",
          "Fuel Type": item.vehicleType?.fuel || "N/A",
          Brand: item.model?.brand || "N/A",
          "Owned By": item.ownedBy?.name || "N/A",
          Aggregator: item.aggregator?.name || "N/A",
        }));

        const vehicleSheet = XLSX.utils.json_to_sheet(vehicleSheetData);
        const vehicleWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(vehicleWorkbook, vehicleSheet, "Vehicles");
        XLSX.writeFile(vehicleWorkbook, "Vehicle_Data.xlsx");
        break;

      // case 3:
      //   const location = locationData.map((item, index) => ({
      //     "Sr. No.": index + 1,
      //     "Vehicle No": item.vehicleNo,
      //     Code: item.code,
      //     "Registration Expiry": item.registrationExpiry,
      //     Emirates: item.emirates,
      //     "Chassis Number": item.chasisNumber,
      //     Status: item.status,
      //     "Vehicle Type": item.vehicleType?.name || "N/A",
      //     "Fuel Type": item.vehicleType?.fuel || "N/A",
      //     Brand: item.model?.brand || "N/A",
      //     "Owned By": item.ownedBy?.name || "N/A",
      //     Aggregator: item.aggregator?.name || "N/A",
      //   }));

      //   const vehicleSheet = XLSX.utils.json_to_sheet(vehicleSheetData);
      //   const vehicleWorkbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(vehicleWorkbook, vehicleSheet, "Vehicles");
      //   XLSX.writeFile(vehicleWorkbook, "Vehicle_Data.xlsx");
      //   break;

      default:
        console.error("Invalid value passed for export");
        break;
    }
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
                  clearFields();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  vehicleInputs?.isEditing
                    ? updateEmployee()
                    : uploadEmployeeData(fileData);
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
              <label htmlFor="vehicleNo">Vehicle No.</label>
              <input
                type="text"
                disabled={vehicleInputs?.isEditing}
                className="form-control"
                id="vehicleno"
                name="vehicleno"
                value={vehicleInputs?.vehicleNo}
                onChange={handleInputChange}
                placeholder="Enter vehicle no."
              />
            </div>
            <div className="form-group">
              <label htmlFor="chasisNo">Chasis No.</label>
              <input
                disabled={vehicleInputs?.isEditing}
                type="text"
                className="form-control"
                id="chasisNo"
                name="chasisNo"
                value={vehicleInputs?.chasisNo}
                onChange={handleInputChange}
                placeholder="Enter chasis no."
              />
            </div>
            <div className="form-group">
              <label htmlFor="Code">Plate Code</label>
              <input
                type="text"
                className="form-control"
                id="vehicleCode"
                name="vehicleCode"
                value={vehicleInputs?.code}
                onChange={handleInputChange}
                placeholder="Enter vehicle no."
              />
            </div>
            <div className="form-group">
              <label htmlFor="aggregators">Aggregator</label>
              <select
                className="form-control"
                id="aggregators"
                name="aggregators"
                value={vehicleInputs?.aggregator}
                onChange={handleSelectChange}
              >
                <option value="">Select an aggregator</option>
                {apiData?.aggregators?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categories">Category</label>
              <select
                className="form-control"
                id="categories"
                name="categories"
                value={vehicleInputs?.vehicleType}
                onChange={handleSelectChange}
              >
                <option value="">Select a category</option>
                {apiData?.categories?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {`${item.name} ${item.fuel}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ownedBy">Owned By</label>
              <select
                className="form-control"
                id="ownedBy"
                name="ownedBy"
                value={vehicleInputs?.ownedby}
                onChange={handleSelectChange}
              >
                <option value="">Select owner</option>
                {apiData?.ownedBy?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="models">Model</label>
              <select
                className="form-control"
                id="models"
                name="models"
                value={vehicleInputs?.model}
                onChange={handleSelectChange}
              >
                <option value="">Select a model</option>
                {apiData?.models?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="emirates">Emirates</label>
              <select
                className="form-control"
                id="emirates"
                name="emirates"
                value={vehicleInputs?.emirates}
                onChange={handleSelectChange}
              >
                <option value="">Select emirates</option>
                {Emirates?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expDate" className="form-label">
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control w-100"
                id="expiryDate"
                value={date}
                onChange={handleDateChange}
              />
            </div>

            <div className="d-flex gap-3">
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  showModalform(false);
                  clearFields();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: themeColor }}
                onClick={() => {
                  vehicleInputs?.isEditing
                    ? updateVehicle()
                    : uploadVehicleData(fileData);
                }}
                disabled={btnLoader}
              >
                {!btnLoader ? (
                  vehicleInputs?.isEditing ? (
                    "Update"
                  ) : (
                    "Submit"
                  )
                ) : (
                  <ButtonLoader />
                )}
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
                  vehicleInputs?.isEditing
                    ? updateLocationData()
                    : addLocationData();
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
              onClick={() => {}}
              disabled={transactionBtn}
            >
              {"Submit"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const Popup = ({ message, onClose }) => {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
        }}
      >
        <img src={alrtSign} alt="alert-popup" className={styles.alert__img} />
        <h4>Warning</h4>
        <strong>{message}</strong>
        <button
          className="btn btn-danger"
          onClick={onClose}
          style={{
            marginTop: "10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
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
                className={`btn btn-primary mb-3 ${styles.add__btn}`}
                onClick={handleButtonClick}
              >
                Bulk Import{" "}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <i className="bi bi-cloud-arrow-up"></i>
              </button>
            )}
            {value !== 0 && (
              <div>
                <button
                  className={`btn btn-primary mb-3 ${styles.add__btn}`}
                  onClick={handleClick}
                >
                  <i className="bi bi-plus-circle me-2"></i> Add
                </button>

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
                  className={`btn btn-primary mb-3 ${styles.add__btn}`}
                  onClick={exportDataToExcel}
                >
                  Excel Export <i className="bi bi-download"></i>
                </button>
              }
              {value === 2 && (
                <button
                  className={`btn btn-primary mb-3 ${styles.add__btn}`}
                  onClick={() => {
                    setTransactionModal(true);
                  }}
                >
                  Transaction Allocation{" "}
                  <i className="bi bi-arrow-left-right"></i>
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
              onClick={submitFile}
            >
              {btnLoader ? <ButtonLoader /> : "Submit"}
            </button>
          </div>
        )}
        <div className={styles.header__tab}>
          <div
            className={
              value === 0 ? styles.filter__container : styles.without__filters
            }
          >
            <div
              className={`mb-3 ${value === 0 ? "w-100" : ""}`}
              style={{ width: "300px" }}
            >
              {/* Search Input Field */}
              <label htmlFor="endDate" className="form-label">
                Search...
              </label>
              <input
                type="text"
                className="form-control"
                id="startDate"
                placeholder="Search..."
                onChange={(e) => handleFilterChange("search", e.target.value)}
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
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
                {/* Select Input for Checin and checkout */}
                <div className="mb-3 w-100">
                  <label htmlFor="availability" className="form-label">
                    Status Filter
                  </label>
                  <select
                    className="form-select w-100"
                    id="availability"
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="all" defaultChecked>
                      Select status
                    </option>
                    <option value="in">Check in</option>
                    <option value="out">Check out</option>
                  </select>
                </div>
              </>
            )}
          </div>
          {/* Apply Filter Button */}
          {showApplyButton && (
            <div className={styles.filter__box}>
              <button className="btn btn-success" onClick={applyFilters}>
                Apply Filters
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Remove Filter <i className="bi bi-x-circle"></i>
              </button>
            </div>
          )}
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
                <Tab
                  label="Reports(Work in progess!)"
                  {...a11yProps(5)}
                  disabled
                />
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
                    <TableCell>Vehicle Details</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Images</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filters?.filterData?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row?.employee?.code}</TableCell>
                      <TableCell>{row?.employee?.name}</TableCell>
                      <TableCell>
                        <div className={styles.plate__code}>
                          <span>
                            <strong>{`${row?.vehicle?.code || ""}`}</strong>{" "}
                          </span>
                          <span className={styles.emirates}>
                            {row?.vehicle?.emirates === "Dubai"
                              ? "DXB"
                              : row?.vehicle?.emirates === "Sharjah"
                              ? "SHJ"
                              : row?.vehicle?.emirates === "AbuDhabi"
                              ? "AUH"
                              : ""}
                          </span>
                          <span>
                            {" "}
                            <strong>{row?.vehicle?.vehicleNo}</strong>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {row?.vehicle
                          ? `${row.vehicle.model?.brand} (${row.vehicle.vehicleType?.name} ${row.vehicle.vehicleType?.fuel})`
                          : ""}
                      </TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell align="center">{row.time}</TableCell>
                      <TableCell align="center">
                        {row?.location?.name}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.action === "in" ? "Check in" : "Check out"}
                          color={row.action === "in" ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <i
                          className="bi bi-eye cursor-pointer"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleImageClick(row.pictures);
                            console.log("Click", row.pictures);
                          }}
                        ></i>
                      </TableCell>
                      <TableCell>
                        <td>
                          <div className={styles.btn_box}>
                            <i
                              className="bi bi-pencil-square"
                              style={{ color: "#fff" }}
                              // onClick={() => editEmployeemodal(row)}
                            ></i>
                          </div>
                        </td>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row?.comments || "No comments"}>
                          <i className="bi bi-chat"></i>
                        </Tooltip>
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
                    <TableCell sx={{ fontWeight: "bold" }}>Edit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData
                    ? employeeData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.code}</TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell>
                            <td>
                              <div className={styles.btn_box}>
                                <i
                                  className="bi bi-pencil-square"
                                  style={{ color: "#fff" }}
                                  onClick={() => editEmployeemodal(row)}
                                ></i>
                              </div>
                            </td>
                          </TableCell>
                          <TableCell>
                            <td>
                              <div className={styles.btn_box_del}>
                                <i
                                  className="bi bi-trash"
                                  style={{ color: "#fff" }}
                                  onClick={() => {
                                    handleDeleteClick(row?.id);
                                  }}
                                ></i>
                              </div>
                            </td>
                          </TableCell>
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
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Plate Code
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
                      Expiry Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Availability Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Edit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData?.length > 0
                    ? vehicleData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.vehicleNo}</TableCell>
                          <TableCell align="left">{row?.code}</TableCell>
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
                          <TableCell>
                            <td>
                              <div className={styles.btn_box}>
                                <i
                                  className="bi bi-pencil-square"
                                  style={{ color: "#fff" }}
                                  onClick={() => editVehicleModal(row)}
                                ></i>
                              </div>
                            </td>
                          </TableCell>
                          <TableCell>
                            <td>
                              <div className={styles.btn_box_del}>
                                <i
                                  className="bi bi-trash"
                                  style={{ color: "#fff" }}
                                  onClick={() => {
                                    handleDeleteClick(row?.id);
                                  }}
                                ></i>
                              </div>
                            </td>
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
                    <TableCell sx={{ fontWeight: "bold" }}>Edit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationData
                    ? locationData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell align="left">{row?.fullAddress}</TableCell>
                          <TableCell>
                            <td>
                              <div className={styles.btn_box}>
                                <i
                                  className="bi bi-pencil-square"
                                  style={{ color: "#fff" }}
                                  onClick={() => {
                                    editLocationModal(row);
                                  }}
                                ></i>
                              </div>
                            </td>
                          </TableCell>
                          <TableCell>
                            <td>
                              <div className={styles.btn_box_del}>
                                <i
                                  className="bi bi-trash"
                                  style={{ color: "#fff" }}
                                  onClick={() => {
                                    {
                                      handleDeleteClick(row?.id);
                                    }
                                  }}
                                ></i>
                              </div>
                            </td>
                          </TableCell>
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
          {["back", "front", "left", "right"]?.map((position) => {
            const imageObj = selectedImages?.find((img) => img.value[position]);

            const urlid =
              imageObj && imageObj?.value[position]?.url
                ? extractGoogleDriveFileId(imageObj?.value[position]?.url)
                : null;

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
      <Modal
        open={modalForm}
        onClose={() => {
          showModalform(false);
          clearFields();
        }}
      >
        <Box sx={style}>
          {/* Modal Content */}
          <Box sx={scrollableStyle}>{renderModalforma()}</Box>
        </Box>
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
      <Modal open={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <h5>Are you sure you want to delete this item?</h5>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeletePopup(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteFunction();
              }}
              disabled={btnLoader}
            >
              {btnLoader ? <ButtonLoader /> : "Delete"}
            </button>
          </div>
        </Box>
      </Modal>

      {popupVisible && (
        <Popup
          message="Few entries were not uploaded. Kindly check the downloaded file."
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Dashboard;
