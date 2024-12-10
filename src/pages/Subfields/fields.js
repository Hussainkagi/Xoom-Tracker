import React, { useEffect, useState } from "react";
import styles from "./fields.module.css";
import apiHelper from "../../utils/apiHelper/apiHelper";
import DataLoader from "../../components/DataLoader/loader";

function Fields() {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [apiData, setApiData] = useState({
    aggregators: [],
    categories: [],
    ownedBy: [],
    models: [],
  });
  const [dataLoader, setdataLoader] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Common onChange handler
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleApiData = (key, value) => {
    setApiData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [aggregatorData, setAggregatorData] = useState([
    { id: 1, name: "Aggregator 1" },
    { id: 2, name: "Aggregator 2" },
  ]);

  // Modal forms configuration
  const modalConfig = {
    aggregator: {
      title: "Add Aggregator",
      fields: [{ label: "Name", name: "aggregatorName", type: "text" }],
    },
    category: {
      title: "Add Category",
      fields: [
        { label: "Type", name: "categoryName", type: "text" },
        { label: "Fuel", name: "fuel", type: "text" },
      ],
    },
    ownedBy: {
      title: "Add Owned By",
      fields: [{ label: "Name", name: "ownedByName", type: "text" }],
    },
    model: {
      title: "Add Model",
      fields: [{ label: "Name", name: "modelName", type: "text" }],
    },
  };

  //   ************************API's*******************************

  //Post APIS
  const createAggregator = async () => {
    let body = {
      name: formData?.aggregatorName,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/aggregator");
    } catch (err) {}
  };

  const createOwnedBy = async () => {
    let body = {
      name: formData?.ownedByName,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/owned-by");
    } catch (err) {}
  };

  const createModel = async () => {
    let body = {
      brand: formData?.modelName,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/model");
    } catch (err) {}
  };

  const createVehicleType = async () => {
    let body = {
      name: formData?.categoryName,
      fuel: formData?.fuel,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/vehicle-type");
    } catch (err) {}
  };

  //Get APIS
  const fetchAllData = async () => {
    // setShowSplash(true);
    setdataLoader(true);
    try {
      const [aggregator, ownedBy, model, vehicleType] = await Promise.all([
        apiHelper.get("/aggregator"),
        apiHelper.get("/owned-by"),
        apiHelper.get("/model"),
        apiHelper.get("/vehicle-type"),
      ]);

      handleApiData("aggregators", aggregator?.data);
      handleApiData("ownedBy", ownedBy?.data);
      handleApiData("models", model?.data);
      handleApiData("categories", vehicleType?.data);
      setdataLoader(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      //   setShowSplash(false); // Hide splash loader once all data is fetched
    }
  };

  //   ************************API's*******************************

  const submitForms = () => {
    switch (activeModal) {
      case "aggregator":
        createAggregator();
        break;
      case "category":
        createVehicleType();
        break;
      case "ownedBy":
        createOwnedBy();
        break;
      case "model":
        createModel();
        break;
      default:
        console.log("No active modal");
    }
  };

  const renderAggregatorTable = () => (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {aggregatorData.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>
              <div className={styles.btn_box}>
                <i className="bi bi-trash" style={{ color: "#fff" }}></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const renderOwnedByTable = () => (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {apiData?.ownedBy.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>
              <div className={styles.btn_box}>
                <i className="bi bi-trash" style={{ color: "#fff" }}></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const renderCategoryTable = () => (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Fuel type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {apiData?.categories.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.fuel}</td>

            <td>
              <div className={styles.btn_box}>
                <i className="bi bi-trash" style={{ color: "#fff" }}></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const renderModelTable = () => (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {apiData?.models.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>

            <td>
              <div className={styles.btn_box}>
                <i className="bi bi-trash" style={{ color: "#fff" }}></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.main__container}>
      <div className={styles.parent__container}>
        {/* Tables and Add buttons */}
        <div className="row">
          <div className="col-md-6">
            <Accordion
              title="Add Aggregator"
              table={renderAggregatorTable}
              onAddClick={() => setActiveModal("aggregator")}
            />
          </div>
          <div className="col-md-6">
            <Accordion
              title="Add Category"
              table={renderAggregatorTable}
              onAddClick={() => setActiveModal("category")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Accordion
              title="Add Owned By"
              table={renderAggregatorTable}
              onAddClick={() => setActiveModal("ownedBy")}
            />
          </div>
          <div className="col-md-6">
            <Accordion
              title="Add Model"
              table={renderAggregatorTable}
              onAddClick={() => setActiveModal("model")}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalConfig[activeModal].title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActiveModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  {modalConfig[activeModal].fields.map((field) => (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-control"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    submitForms();
                    setActiveModal(null);
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({ title, onAddClick, table }) {
  return (
    <div className="accordion mb-2">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            aria-expanded="true"
          >
            {title}
          </button>
        </h2>
        <div className="accordion-collapse collapse show">
          <div className="accordion-body">
            <button
              className="btn text-white mb-3"
              style={{ backgroundColor: "#9acb3b" }}
              onClick={onAddClick}
            >
              Add
            </button>
            {table()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fields;
