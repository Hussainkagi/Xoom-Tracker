import styles from "./dashboard.module.css";
import * as React from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import TextField from "@mui/material/TextField";

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

function createData(empCode, name, vehicleNum, time, date, location, status) {
  return { empCode, name, vehicleNum, time, date, location, status };
}
const emp = [
  {
    code: "XDS45002",
    name: "Altafh Bin Abdullah",
  },
  {
    code: "XDS002",
    name: "Mohd. Bin Uzair",
  },
];

let locas = ["sharjah warehouse", "abu hail", "jumeira"];
const rows = [
  createData(
    "XDS45001",
    "Arshid",
    "DXB123",
    "11:30 AM",
    "11/01/2024",
    "Abu Hail",
    "Check In"
  ),
  createData(
    "XDS45002",
    "Ahsan",
    "DXB453",
    "12:30 PM",
    "11/01/2024",
    "Abu Hail",
    "Check In"
  ),
  createData(
    "XDS45001",
    "harshul",
    "DXB223",
    "5:30 PM",
    "11/01/2024",
    "Abu Hail",
    "Check Out"
  ),
];

const Dashboard = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.parent__container}>
        <div>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-primary btn-sm"
            style={{
              backgroundColor: "#9acb3b",
              border: "none",
            }}
          >
            Import
          </button>
        </div>
        <div className={styles.header__tab}>
          <div className={styles.filter__container}>
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

            {/* Select input for Availability */}
            {/* <div className="mb-3 w-100">
              <label htmlFor="availability" className="form-label">
                Availability
              </label>
              <select className="form-select w-100" id="availability">
                <option value="available">Available</option>
                <option value="notAvailable">Not Available</option>
              </select>
            </div> */}
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
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Employee Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Vehicle number
                    </TableCell>
                    <TableCell align="centre">Date</TableCell>
                    <TableCell align="centre">Time</TableCell>
                    <TableCell align="centre">Location</TableCell>
                    <TableCell align="centre">status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.empCode}
                      </TableCell>
                      <TableCell align="centre">{row.name}</TableCell>
                      <TableCell align="centre">{row.vehicleNum}</TableCell>
                      <TableCell align="centre">{row.date}</TableCell>
                      <TableCell align="centre">{row.time}</TableCell>
                      <TableCell align="centre">{row.location}</TableCell>
                      <TableCell align="centre">
                        <Chip
                          label={row.status}
                          color={
                            row.status === "Check In" ? `success` : "error"
                          }
                        />
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
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Employee Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emp.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{row.code}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Vehicles
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locas.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
