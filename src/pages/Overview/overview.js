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
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#007bff", "#ffc107", "#00eb79"], // Add more colors if needed
        hoverBackgroundColor: ["#0056b3", "#d39e00", "#1e7e34"], // Add more hover colors if needed
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
  }, []);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // Legend position
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
        formatter: (value) => `${value} `, // Add "AED" to numbers
      },
    },
  };
  const barChartData = {
    Day: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Days in a month
      datasets: [
        {
          label: "transactions",
          data: Array.from({ length: 30 }, () =>
            Math.floor(Math.random() * 5000 + 10000)
          ),
          backgroundColor: "#9acb3b",
        },
      ],
    },
    Month: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "transactions",
          data: [
            120000, 130000, 125000, 140000, 150000, 140000, 135000, 130000,
            125000, 135000, 140000, 150000,
          ],
          backgroundColor: "#9acb3b",
        },
      ],
    },
    Year: {
      labels: ["2022", "2023", "2024"],
      datasets: [
        {
          label: "transactions",
          data: [1450000, 1500000, 1550000],
          backgroundColor: "#9acb3b",
        },
      ],
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
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

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example labels
    datasets: [
      {
        label: "Check-In",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        tension: 0, // Smooth curve
      },
      {
        label: "Check-Out",
        data: [5, 15, 8, 10, 7, 4],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0, // Smooth curve
      },
    ],
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
      const [aggregator, ownedBy, model, vehicleType] = await Promise.all([
        apiHelper.get("/vehicle/aggregator-count", {}, headers),
        apiHelper.get("/vehicle/owner-count", {}, headers),
        apiHelper.get("/vehicle/model-count", {}, headers),
        apiHelper.get("/vehicle/vehicle-type-count", {}, headers),
      ]);

      handleApiData("aggregators", aggregator?.data);
      handleApiData("ownedBy", ownedBy?.data);
      handleApiData("models", model?.data);
      handleApiData("vehicleType", vehicleType?.data);

      //Set Chart Data
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
    const labels = aggregatorData.map((item) => item.aggregatorName);
    const data = aggregatorData.map((item) => parseInt(item.vehicleCount, 10));

    console.log("Labels", labels);
    setPieChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#007bff", "#ffc107", "#00eb79"], // Adjust colors if needed
          hoverBackgroundColor: ["#0056b3", "#d39e00", "#1e7e34"], // Adjust hover colors
        },
      ],
    });
  };

  return (
    <div className={styles.parent__container}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Vehicle by Aggregator</h5>
                <div className="d-flex">
                  <div className={styles.chart__parent}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                  <div>
                    <div>
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
                            {/* Color indicator */}
                            <span
                              style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor:
                                  pieChartData.datasets[0].backgroundColor[
                                    index
                                  ],
                                marginRight: "10px",
                              }}
                            ></span>
                            {/* Label and Value */}
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
          </div>

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Vehicle by Aggregator</h5>
                <div className="d-flex">
                  <div className={styles.chart__parent}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                  <div>
                    <div>
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
                            {/* Color indicator */}
                            <span
                              style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor:
                                  pieChartData.datasets[0].backgroundColor[
                                    index
                                  ],
                                marginRight: "10px",
                              }}
                            ></span>
                            {/* Label and Value */}
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
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle by Model</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Count</th>
                      <th>Free</th>
                      <th>occupied</th>
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
                <h5>Total Vehicle : 35</h5>
                <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle by owner</h5>
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
                <h5>Total Vehicle : 35</h5>
                <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle by Type</h5>
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
                <h5>Total Vehicle : 35</h5>
                <button className="btn btn-success btn-sm mt-3">
                  View detailed table
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title">Transaction</h5>
                  {/* Select dropdown for category */}
                  <select
                    className="form-select w-auto"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="Day">Categorise by Days</option>
                    <option value="Month">Categorise by Months</option>
                    <option value="Year">Categorise by Years</option>
                  </select>
                </div>
                {/* Render Bar chart */}
                <div>
                  <Line data={getChartData()} options={lineChartOptions} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title">Transaction</h5>
                  {/* Select dropdown for category */}
                  <select
                    className="form-select w-auto"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="Day">Categorise by Days</option>
                    <option value="Month">Categorise by Months</option>
                    <option value="Year">Categorise by Years</option>
                  </select>
                </div>
                {/* Render Bar chart */}
                <div>
                  <Bar
                    data={barChartData[category]}
                    options={barChartOptions}
                  />
                </div>
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
