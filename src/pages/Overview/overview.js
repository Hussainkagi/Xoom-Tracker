import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import Splashscreen from "../../components/Splashscreen/splashloader";
import styles from "./overview.module.css";
import apiHelper from "../../utils/apiHelper/apiHelper";

ChartJS.register(
  ArcElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend
);

function Overview() {
  const [category, setCategory] = useState("Month");
  const [splashloader, setSplashLoader] = useState(false);
  const [apiData, setApiData] = useState({
    aggregators: [],
    vehicleType: [],
    ownedBy: [],
    models: [],
    locationBy: [],
  });
  const [chartData, setChartData] = useState(null);

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });
  const [vehiclePieChartData, setVehiclePieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });
  // const pieChartData = {
  //   labels: ["Amazon", "Noon", "Careem"],
  //   datasets: [
  //     {
  //       data: [2500, 1500, 1000], // Dummy data for available balance breakdown
  //       backgroundColor: ["#007bff", "#ffc107", "#00eb79"], // Colors for the segments
  //       hoverBackgroundColor: ["#0056b3", "#d39e00", "#1e7e34"], // Hover colors
  //     },
  //   ],
  // };

  useEffect(() => {
    fetchAllData();
    fetchData();
  }, []);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      datalabels: {
        display: true, // Ensure labels are displayed
        color: "#fff", // White text for better visibility
        anchor: "center", // Anchor labels to center of segments
        align: "center", // Align text in center of segments
        font: {
          size: 12,
          weight: "bold",
        },
        formatter: (value) => `${value}`, // Customize label format if needed
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Entries",
        },
        beginAtZero: true,
      },
    },
  };
  const lineChartOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Actions",
        },
      },
    },
  };

  const getChartData = () => {
    switch (category) {
      case "Day":
        return {
          labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          datasets: [
            {
              label: "Check-In",
              data: [3, 8, 6, 4, 5, 2, 7],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              tension: 0,
            },
            {
              label: "Check-Out",
              data: [4, 6, 5, 8, 3, 6, 2],
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0,
            },
          ],
        };
      case "Month":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Check-In",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              tension: 0,
            },
            {
              label: "Check-Out",
              data: [5, 15, 8, 10, 7, 4],
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0,
            },
          ],
        };
      case "Year":
        return {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Check-In",
              data: [200, 300, 250, 400, 350],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              tension: 0,
            },
            {
              label: "Check-Out",
              data: [180, 280, 240, 380, 320],
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              tension: 0,
            },
          ],
        };
      default:
        return {};
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleApiData = (key, value) => {
    setApiData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // *************************Fetch Api's****************************
  const fetchAllData = async () => {
    setSplashLoader(true);
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      const [aggregator, ownedBy, model, vehicleType, byLocation] =
        await Promise.all([
          apiHelper.get("/vehicle/aggregator-count", {}, headers),
          apiHelper.get("/vehicle/owner-count", {}, headers),
          apiHelper.get("/vehicle/model-count", {}, headers),
          apiHelper.get("/vehicle/vehicle-type-count", {}, headers),
          apiHelper.get("/vehicle/by-location", {}, headers),
        ]);

      handleApiData("aggregators", aggregator?.data);
      handleApiData("ownedBy", ownedBy?.data);
      handleApiData("models", model?.data);
      handleApiData("vehicleType", vehicleType?.data);
      handleApiData("locationBy", byLocation?.data);

      //Set Chart Data
      setVehicleTypePieChartData(vehicleType?.data);
      setAggregatorPieChartData(aggregator?.data);

      setTimeout(() => {
        setSplashLoader(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSplashLoader(false);
    }
  };

  const setAggregatorPieChartData = (aggregatorData) => {
    const filteredData = aggregatorData.filter(
      (item) =>
        item.aggregatorName !== null && item.aggregatorName.trim() !== ""
    );

    const labels = filteredData.map((item) => item.aggregatorName);
    const data = filteredData.map((item) => parseInt(item.vehicleCount, 10));

    // Generate random colors and maintain consistency
    const colors = labels.map(() => generateRandomColor());

    setPieChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          hoverBackgroundColor: colors.map((color) => lightenColor(color, 20)),
        },
      ],
      colors, // Maintain the same colors for the list
    });
  };

  const setVehicleTypePieChartData = (vehicleTypeData) => {
    // Filter out data with invalid vehicleTypeName or zero available count
    const filteredData = vehicleTypeData.filter(
      (item) =>
        item.vehicleTypeName !== null &&
        item.vehicleTypeName.trim() !== "" &&
        parseInt(item.occupied, 10) > 0
    );

    const labels = filteredData.map((item) => item.vehicleTypeName);
    const data = filteredData.map((item) => parseInt(item.occupied, 10));
    console.log("logs", labels);
    // Generate random colors and maintain consistency
    const colors = labels.map(() => generateRandomColor());

    setVehiclePieChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          hoverBackgroundColor: colors.map((color) => lightenColor(color, 20)),
        },
      ],
      colors, // Maintain the same colors for the list
    });
  };

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor.padEnd(7, "0"); // Ensure 7-character color code
  };

  const lightenColor = (color, percent) => {
    // Lighten a color by a given percentage
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  const calculateTotal = (dataArray, fieldName) => {
    return dataArray?.reduce(
      (total, item) => total + (parseInt(item[fieldName]) || 0),
      0
    );
  };

  // ***************************transaction line chart Data processing********************
  const fetchData = async () => {
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      const response = await apiHelper.get(
        "/transaction/filter?months=0",
        {},
        headers
      );
      const data = response.data;

      const processedData = processChartData(data);

      console.log("****************");
      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processChartData = (data) => {
    const currentMonth = moment().month();
    const today = moment();

    // Create an object to store counts for each day
    const counts = {};
    for (let i = 1; i <= today.date(); i++) {
      const date = moment().date(i).format("YYYY-MM-DD");
      counts[date] = { in: 0, out: 0 };
    }

    // Populate the counts object
    data.forEach((entry) => {
      const entryDate = moment(entry.date, "YYYY-MM-DD");
      if (entryDate.month() === currentMonth) {
        const dateStr = entryDate.format("YYYY-MM-DD");

        // Ensure the date exists in the counts object
        if (!counts[dateStr]) {
          counts[dateStr] = { in: 0, out: 0 };
        }

        if (entry.action === "in") {
          counts[dateStr].in++;
        } else if (entry.action === "out") {
          counts[dateStr].out++;
        }
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(counts).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const checkInData = labels.map((date) => counts[date].in);
    const checkOutData = labels.map((date) => counts[date].out);

    console.log("labels", labels);

    return {
      labels,
      datasets: [
        {
          label: "Check-In",
          data: checkInData,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          tension: 0.4,
        },
        {
          label: "Check-Out",
          data: checkOutData,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className={styles.parent__container}>
      <div className="container mt-4">
        <div className="row">
          <div className="row">
            <div className="col-lg-6 col-md-6 mb-4">
              <div
                className="card bg-light shadow-sm"
                style={{ height: "100%" }}
              >
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">Vehicle by Aggregator</h5>
                  <div
                    className="d-flex align-items-center"
                    style={{ flex: "1 0 auto" }}
                  >
                    <div
                      className={styles.chart__parent}
                      style={{ flex: "1 1 auto", maxWidth: "50%" }}
                    >
                      <Pie
                        data={pieChartData}
                        options={pieChartOptions}
                        style={{ height: "250px", width: "250px" }}
                      />
                    </div>
                    <div
                      style={{
                        flex: "1 1 auto",
                        maxHeight: "200px",
                        overflowY: "auto",
                        marginLeft: "20px",
                      }}
                      className={styles.pie__card}
                    >
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {pieChartData.labels.map((label, index) => (
                          <li
                            key={label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor: pieChartData.colors[index],
                                marginRight: "10px",
                              }}
                            ></span>
                            <span>
                              {label}: {pieChartData.datasets[0].data[index]}{" "}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 mb-4">
              <div
                className="card bg-light shadow-sm"
                style={{ height: "100%" }}
              >
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">Occupied Vehicle by Category</h5>
                  <div
                    className="d-flex align-items-center"
                    style={{ flex: "1 0 auto" }}
                  >
                    <div
                      className={styles.chart__parent}
                      style={{ flex: "1 1 auto", maxWidth: "50%" }}
                    >
                      <Pie
                        data={vehiclePieChartData}
                        options={pieChartOptions}
                        style={{ height: "250px", width: "250px" }}
                      />
                    </div>
                    <div
                      style={{
                        flex: "1 1 auto",
                        maxHeight: "200px",
                        overflowY: "auto",
                        marginLeft: "20px",
                      }}
                      className={styles.pie__card}
                    >
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {vehiclePieChartData.labels.map((label, index) => (
                          <li
                            key={label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor:
                                  vehiclePieChartData.colors[index],
                                marginRight: "10px",
                              }}
                            ></span>
                            <span>
                              {label}:{" "}
                              {vehiclePieChartData.datasets[0].data[index]}{" "}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className={`card-body ${styles.scrollable__card}`}>
                <h5 className="card-title">Vehicle by Model</h5>
                <div className={styles.table__container}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>Count</th>
                        <th>Free</th>
                        <th>Occupied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiData?.models?.map((data, index) => (
                        <tr key={index}>
                          <td>{data?.modelBrand}</td>
                          <td>{data?.vehicleCount}</td>
                          <td>{data?.available}</td>
                          <td>{data?.occupied}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h5>
                  Total Vehicle:{" "}
                  {calculateTotal(apiData?.models, "vehicleCount")}
                </h5>
                {/* <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button> */}
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle by Owner</h5>
                <div className={styles.table__container}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Owned by</th>
                        <th>Count</th>
                        <th>Free</th>
                        <th>Occupied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiData?.ownedBy?.map((data, index) => (
                        <tr key={index}>
                          <td>{data?.ownerName}</td>
                          <td>{data?.vehicleCount}</td>
                          <td>{data?.available}</td>
                          <td>{data?.occupied}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h5>
                  Total Vehicle:{" "}
                  {calculateTotal(apiData?.ownedBy, "vehicleCount")}
                </h5>
                {/* <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button> */}
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body scrollable-card">
                <h5 className="card-title">Vehicle by Type</h5>
                <div className={styles.table__container}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Count</th>
                        <th>Free</th>
                        <th>Occupied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiData?.vehicleType?.map((data, index) => (
                        <tr key={index}>
                          <td>{data?.vehicleTypeName}</td>
                          <td>{data?.vehicleCount}</td>
                          <td>{data?.available}</td>
                          <td>{data?.occupied}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h5>
                  Total Vehicle:{" "}
                  {calculateTotal(apiData?.vehicleType, "vehicleCount")}
                </h5>
                {/* <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title">Transaction</h5>
                  {/* Select dropdown for category */}
                  {/* <select
                    className="form-select w-auto"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="Day">Categorise by Days</option>
                    <option value="Month">Categorise by Months</option>
                    <option value="Year">Categorise by Years</option>
                  </select> */}
                </div>
                {/* Render Bar chart */}
                <div>
                  {chartData && (
                    <Line data={chartData} options={lineChartOptions} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle by Locations</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Count</th>
                      <th>Free</th>
                      <th>Occupied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiData?.locationBy?.map((data, index) => (
                      <tr key={index}>
                        <td>{data?.locationName}</td>
                        <td>{data?.vehicleCount}</td>
                        <td>{data?.available}</td>
                        <td>{data?.occupied}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h5>
                  Total Vehicle :{" "}
                  {calculateTotal(apiData?.locationBy, "vehicleCount")}
                </h5>
                {/* <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {splashloader && <Splashscreen />}
    </div>
  );
}

export default Overview;
