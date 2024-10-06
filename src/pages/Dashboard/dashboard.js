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

function createData(empCode, name, vehicleNum, time, date, location, status) {
  return { empCode, name, vehicleNum, time, date, location, status };
}

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
        <div className={styles.tabs}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Transactions" {...a11yProps(0)} />
              <Tab label="Drivers" {...a11yProps(1)} />
              <Tab label="Vehicles" {...a11yProps(2)} />
              <Tab label="Locations" {...a11yProps(3)} />
            </Tabs>
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
            Drivers
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Vehicles
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Locations
          </CustomTabPanel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
