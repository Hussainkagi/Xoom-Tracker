import React, { useEffect, useState } from "react";
import styles from "./fields.module.css";
import apiHelper from "../../utils/apiHelper/apiHelper";
import DataLoader from "../../components/DataLoader/loader";
import Splashscreen from "../../components/Splashscreen/splashloader";
import { Modal, Box } from "@mui/material";
import Toast from "../../components/Toast/toast";

function Fields() {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: "" });
  const [apiData, setApiData] = useState({
    aggregators: [],
    categories: [],
    ownedBy: [],
    models: [],
  });
  const [dataLoader, setdataLoader] = useState({
    aggLoader: false,
    catLoader: false,
    ownedLoader: false,
    modelLoader: false,
  });
  const [splashloader, setSplashLoader] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    title: "",
    subtitle: "",
    type: "success",
  });

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

  const handleDeleteClick = (id, type) => {
    setDeleteTarget({ id, type });
    setShowDeletePopup(true);
  };

  const handleApiData = (key, value) => {
    setApiData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleLoaderData = (key, value) => {
    setdataLoader((prevState) => ({
      ...prevState,
      [key]: value,
    }));
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

  const confirmDelete = () => {
    console.log("Are you sure you want to delete", deleteTarget);
    const { id, type } = deleteTarget;

    switch (type) {
      case "aggregator":
        deleteAggregator(id);
        break;
      case "ownedBy":
        deleteOwnedBy(id);
        break;
      case "category":
        deleteVehicleType(id);
        break;
      case "model":
        deleteModel(id);
        break;
      default:
        break;
    }
    setShowDeletePopup(false);
    setDeleteTarget({ id: null, type: "" });
  };

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
        {
          label: "Fuel",
          name: "fuel",
          type: "select",
          options: ["Electric", "ICE", "Hybrid"], // Add dropdown options here
        },
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
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/aggregator", body, headers);
      if (res.success) {
        setFormData({});
        getAggregate();
        showToast("success", "Success", "Aggregator created successfully!");
      } else {
        showToast("error", "Error", res?.message);
      }
    } catch (err) {
      console.log("ee", err);
      showToast("error", "Error", "Something went wrong!!");
    }
  };

  const createOwnedBy = async () => {
    let body = {
      name: formData?.ownedByName,
    };
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/owned-by", body, headers);
      getOwnedBy();
      setFormData({});
    } catch (err) {}
  };

  const createModel = async () => {
    let body = {
      brand: formData?.modelName,
    };
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/model", body, headers);
      getModel();
      setFormData({});
    } catch (err) {}
  };

  const createVehicleType = async () => {
    let body = {
      name: formData?.categoryName,
      fuel: formData?.fuel,
    };
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.post("/vehicle-type", body, headers);
      getCategory();
      setFormData({});
    } catch (err) {}
  };

  //Delete APIS
  const deleteAggregator = async (id) => {
    let body = {
      name: formData?.aggregatorName,
    };
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.del(`/aggregator/${id}`, headers, {});
      getAggregate();
    } catch (err) {}
  };

  const deleteOwnedBy = async (id) => {
    let body = {
      name: formData?.ownedByName,
    };

    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.del(`/owned-by/${id}`, headers, {});
      getOwnedBy();
    } catch (err) {}
  };

  const deleteModel = async (id) => {
    let body = {
      brand: formData?.modelName,
    };

    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.del(`/model/${id}`, headers, {});
      getModel();
    } catch (err) {}
  };

  const deleteVehicleType = async (id) => {
    let body = {
      name: formData?.categoryName,
      fuel: formData?.fuel,
    };
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };

    console.log("body", body);
    try {
      let res = await apiHelper.del(`/vehicle-type/${id}`, headers, {});
      getCategory();
    } catch (err) {}
  };

  //Get APIS
  const fetchAllData = async () => {
    setSplashLoader(true);
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      const [aggregator, ownedBy, model, vehicleType] = await Promise.all([
        apiHelper.get("/aggregator", {}, headers),
        apiHelper.get("/owned-by", {}, headers),
        apiHelper.get("/model", {}, headers),
        apiHelper.get("/vehicle-type", {}, headers),
      ]);

      handleApiData("aggregators", aggregator?.data);
      handleApiData("ownedBy", ownedBy?.data);
      handleApiData("models", model?.data);
      handleApiData("categories", vehicleType?.data);
      setTimeout(() => {
        setSplashLoader(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSplashLoader(false);
    }
  };

  const getAggregate = async () => {
    handleLoaderData("aggLoader", true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let res = await apiHelper.get("/aggregator", {}, headers);
      handleApiData("aggregators", res?.data);
      setTimeout(() => {
        handleLoaderData("aggLoader", false);
      }, 1000);
    } catch (error) {
      handleLoaderData("aggLoader", false);
    }
  };

  const getOwnedBy = async () => {
    handleLoaderData("ownedLoader", true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let res = await apiHelper.get("/owned-by", {}, headers);
      handleApiData("ownedBy", res?.data);
      setTimeout(() => {
        handleLoaderData("ownedLoader", false);
      }, 1000);
    } catch (error) {
      handleLoaderData("ownedLoader", false);
    }
  };
  const getCategory = async () => {
    handleLoaderData("catLoader", true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let res = await apiHelper.get("/vehicle-type", {}, headers);
      handleApiData("categories", res?.data);
      setTimeout(() => {
        handleLoaderData("catLoader", false);
      }, 1000);
    } catch (error) {
      handleLoaderData("catLoader", false);
    }
  };
  const getModel = async () => {
    handleLoaderData("modelLoader", true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let res = await apiHelper.get("/model", {}, headers);
      handleApiData("models", res?.data);
      setTimeout(() => {
        handleLoaderData("modelLoader", false);
      }, 1000);
    } catch (error) {
      handleLoaderData("modelLoader", false);
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

  const renderAggregatorTable = () =>
    dataLoader?.aggLoader ? (
      <DataLoader />
    ) : (
      <div style={{ maxHeight: "180px", overflowY: "auto" }}>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData?.aggregators?.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>
                  <div className={styles.btn_box}>
                    <i
                      className="bi bi-trash"
                      style={{ color: "#fff" }}
                      onClick={() => handleDeleteClick(row.id, "aggregator")}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  const renderOwnedByTable = () =>
    dataLoader?.ownedLoader ? (
      <DataLoader />
    ) : (
      <div style={{ maxHeight: "180px", overflowY: "auto" }}>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData?.ownedBy.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>
                  <div className={styles.btn_box}>
                    <i
                      className="bi bi-trash"
                      style={{ color: "#fff" }}
                      onClick={() => handleDeleteClick(row.id, "ownedBy")}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  const renderCategoryTable = () =>
    dataLoader?.catLoader ? (
      <DataLoader />
    ) : (
      <div style={{ maxHeight: "180px", overflowY: "auto" }}>
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
            {apiData?.categories.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.fuel}</td>

                <td>
                  <div className={styles.btn_box}>
                    <i
                      className="bi bi-trash"
                      style={{ color: "#fff" }}
                      onClick={() => handleDeleteClick(row.id, "category")}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  const renderModelTable = () =>
    dataLoader?.modelLoader ? (
      <DataLoader />
    ) : (
      <div style={{ maxHeight: "180px", overflowY: "auto" }}>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData?.models?.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row?.brand}</td>

                <td>
                  <div className={styles.btn_box}>
                    <i
                      className="bi bi-trash"
                      style={{ color: "#fff" }}
                      onClick={() => handleDeleteClick(row.id, "model")}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              table={renderCategoryTable}
              onAddClick={() => setActiveModal("category")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Accordion
              title="Add Owned By"
              table={renderOwnedByTable}
              onAddClick={() => setActiveModal("ownedBy")}
            />
          </div>
          <div className="col-md-6">
            <Accordion
              title="Add Model"
              table={renderModelTable}
              onAddClick={() => setActiveModal("model")}
            />
          </div>
        </div>
      </div>
      {splashloader && <Splashscreen />}
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
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          className="form-control"
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          className="form-control"
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                        />
                      )}
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
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </Box>
      </Modal>

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
