import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are included
import styles from "./users.module.css";
import apiHelper from "../../utils/apiHelper/apiHelper";
import DataLoader from "../../components/DataLoader/loader";
import Toast from "../../components/Toast/toast";
import Splashscreen from "../../components/Splashscreen/splashloader";

const UserPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [users, setUsers] = useState([]);

  const [showSplash, setShowSplash] = useState(false);
  const [formState, setFormState] = useState({
    first: "",
    last: "",
    userid: "",
    password: "",
    type: "",
  });
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    title: "",
    subtitle: "",
    type: "success",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    getUsers();
  }, []);

  const handleFormState = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const isSupperAdmin = (email) => {
    return email === "xoom@admin.com";
  };

  const validateForm = () => {
    const errors = {};

    if (!formState.first.trim()) errors.first = "First name is required.";
    if (!formState.last.trim()) errors.last = "Last name is required.";
    if (!formState.userid.trim()) errors.userid = "User ID is required.";
    if (!isEditing && !formState.password.trim())
      errors.password = "Password is required for creating a user.";
    if (!formState.type.trim()) errors.type = "User type is required.";

    console.log("error", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenUpdateModal = (user = null) => {
    setIsEditing(true);
    setShowModal(true);
    setUpdateId(user?.id);
    handleFormState("first", user?.firstName);
    handleFormState("last", user?.lastName);
    handleFormState("userid", user?.email);
    handleFormState("type", user?.role);
  };

  const clearFields = () => {
    handleFormState("first", "");
    handleFormState("last", "");
    handleFormState("userid", "");
    handleFormState("type", "");
    handleFormState("password", "");
    setUpdateId("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearFields();
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

  const handleOpenDeletePopup = (user) => {
    setUserToDelete(user);

    setShowDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setUserToDelete(null);
    setShowDeletePopup(false);
  };

  // ************************API's START************************
  const createUsers = async () => {
    if (!validateForm()) return;
    setBtnLoader(true);
    let body = {
      firstName: formState.first,
      lastName: formState.last,
      email: formState.userid,
      password: formState.password,
      role: formState.type,
    };
    let authToken = localStorage.getItem("token");

    let headers = {
      Authorization: "Bearer " + authToken,
    };

    try {
      let response = await apiHelper.post("/users", body, headers);
      if (response.success) {
        setTimeout(() => {
          setBtnLoader(false);
          setShowModal(false);
          clearFields();
          getUsers();
        }, 800);
      } else {
        setBtnLoader(false);
        // setShowModal(false);
        showToast("error", "Error", response.message);
      }
    } catch (err) {
      showToast("error", "Error", "Something went wrong");
      setBtnLoader(false);
    }
  };

  const getUsers = async () => {
    setLoader(true);
    setShowSplash(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let response = await apiHelper.get("/users", {}, headers);
      if (response?.success) {
        setTimeout(() => {
          setShowSplash(false);
          setLoader(false);
        }, 1000);
      } else {
        showToast("error", "Error", response.message);
        setShowSplash(false);
        setLoader(false);
      }

      // setLoader(false);

      setUsers(response?.data);

      console.log("users", response);
    } catch (err) {
      setLoader(false);
      console.error("Error creating users:", err);
    }
  };

  const updateUsers = async () => {
    if (!validateForm()) return;
    setBtnLoader(true);
    let body = {
      password: formState.password,
      // email: formState.userid,
      role: formState.type,
    };
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };

    try {
      let response = await apiHelper.patch(`/users/${updateId}`, body, headers);
      if (response.success) {
        setTimeout(() => {
          setBtnLoader(false);
          setShowModal(false);
          clearFields();
          getUsers();
        }, 800);
      } else {
        setBtnLoader(false);
        // setShowModal(false);
        showToast("error", "Error", response.message);
      }
    } catch (err) {
      console.error("Error updating users:", err);
    }
  };

  const deleteUser = async () => {
    setBtnLoader(true);
    let authToken = localStorage.getItem("token");
    let headers = {
      Authorization: "Bearer " + authToken,
    };
    try {
      let response = await apiHelper.del(
        `/users/${userToDelete?.id}`,
        headers,
        {}
      );
      if (response.success) {
        setTimeout(() => {
          setBtnLoader(false);
          setShowDeletePopup(false);
          clearFields();
          getUsers();
        }, 800);
      } else {
        setBtnLoader(false);
        // setShowModal(false);
        showToast("error", "Error", response.message);
      }

      console.log("users", response);
    } catch (err) {
      console.error("Error deleting users:", err);
    }
  };
  // ************************API's ENDS************************

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Management</h2>

      {/* Add User Button */}
      <button
        className={`btn btn-primary mb-3 ${styles.add__btn}`}
        onClick={() => {
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle me-2"></i> Add User
      </button>

      {/* User Table */}
      {!loader ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Id</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              // Sort users to ensure Super Admin is always at the top
              [...users]
                .sort((a, b) => {
                  if (isSupperAdmin(a?.email)) return -1; // Super Admin first
                  if (isSupperAdmin(b?.email)) return 1;
                  return 0; // Keep the rest in original order
                })
                .map((user, index) => (
                  <tr key={user?.id}>
                    <td>{index + 1}</td>
                    <td>{`${user?.firstName} ${user?.lastName}`}</td>
                    <td>{user?.email}</td>
                    <td>{user?.role}</td>
                    <td>
                      {!isSupperAdmin(user?.email) ? (
                        <>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleOpenUpdateModal(user)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleOpenDeletePopup(user)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      ) : (
                        <span className={styles.super__user__text}>
                          <i className="bi bi-bookmark-star-fill"></i> Super
                          User
                        </span>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Data Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className={styles.loader__box}>
          <DataLoader />
        </div>
      )}

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit User" : "Add User"}
                </h5>
                <button
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              {/* <form> */}
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="first-name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="first-name"
                    placeholder="enter first name"
                    required
                    value={formState.first}
                    onChange={(e) => handleFormState("first", e.target.value)}
                    disabled={isEditing}
                  />
                  {formErrors.first && (
                    <div className={styles.invalid__text}>
                      {formErrors.first}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="last-name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="enter last name"
                    name="last-name"
                    required
                    value={formState.last}
                    onChange={(e) => handleFormState("last", e.target.value)}
                    disabled={isEditing}
                  />
                  {formErrors.last && (
                    <div className={styles.invalid__text}>
                      {formErrors.last}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="userid" className="form-label">
                    User Id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userid"
                    name="userid"
                    placeholder="enter user id"
                    value={formState.userid}
                    onChange={(e) => handleFormState("userid", e.target.value)}
                    required
                  />
                  {formErrors.userid && (
                    <div className={styles.invalid__text}>
                      {formErrors.userid}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    placeholder="enter password"
                    name="password"
                    value={formState.password}
                    onChange={(e) =>
                      handleFormState("password", e.target.value)
                    }
                  />
                  {formErrors.password && (
                    <div className={styles.invalid__text}>
                      {formErrors.password}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">
                    User Type
                  </label>
                  <select
                    className="form-select"
                    id="userType"
                    name="userType"
                    required
                    value={formState.type}
                    onChange={(e) => handleFormState("type", e.target.value)}
                  >
                    <option value="" disabled selected>
                      Select User Type
                    </option>
                    <option value="Viewer">Viewer</option>
                    <option value="Owner">Super user</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
                {formErrors.type && (
                  <div className={styles.invalid__text}>{formErrors.type}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary d-flex justify-content-center align-items-center"
                  disabled={btnLoader}
                  onClick={isEditing ? updateUsers : createUsers}
                >
                  {!btnLoader ? (
                    isEditing ? (
                      "update user"
                    ) : (
                      "Add User"
                    )
                  ) : (
                    <DataLoader size="sm" />
                  )}
                </button>
              </div>
              {/* </form> */}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup for Delete */}
      {showDeletePopup && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={handleCloseDeletePopup}
                ></button>
              </div>
              <div className="modal-body">
                {` Are you sure you want to delete this user?`}{" "}
                <strong>
                  ({`${userToDelete?.firstName} ${userToDelete?.lastName}`})
                </strong>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseDeletePopup}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={deleteUser}
                  disabled={btnLoader}
                >
                  {!btnLoader ? "Delete" : <DataLoader size="sm" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSplash && <Splashscreen />}

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
};

export default UserPage;
