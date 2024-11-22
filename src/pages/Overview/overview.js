import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./overview.module.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Overview() {
  const [category, setCategory] = useState("Month");
  const pieChartData = {
    labels: ["Amazon", "Noon", "Careem"],
    datasets: [
      {
        data: [2500, 1500, 1000], // Dummy data for available balance breakdown
        backgroundColor: ["#007bff", "#ffc107", "#00eb79"], // Colors for the segments
        hoverBackgroundColor: ["#0056b3", "#d39e00", "#1e7e34"], // Hover colors
      },
    ],
  };

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
        formatter: (value) => `${value} AED`, // Add "AED" to numbers
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

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <div className={styles.parent__container}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Vehicle by Aggregator</h5>
                <div className={styles.chart__parent}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Vehicle by Aggregator</h5>
                <div className={styles.chart__parent}>
                  <Pie data={pieChartData} options={pieChartOptions} />
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
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bajaj pulsar</td>
                      <td>20</td>
                      <td>
                        <span className="badge bg-warning">Occupied</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Honda EV</td>
                      <td>20</td>
                      <td>
                        <span className="badge bg-success">Free</span>
                      </td>
                    </tr>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Easy lease</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>Xoom delivery</td>
                      <td>15</td>
                    </tr>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bike electric</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>Van Petrol</td>
                      <td>15</td>
                    </tr>
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
          <div className="col-md-12">
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
    </div>
  );
}

export default Overview;
