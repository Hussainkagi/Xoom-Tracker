import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are included
import styles from "./users.module.css";
import apiHelper from "../../utils/apiHelper/apiHelper";

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ilhvb21AdGVzdC5jb20iLCJzdWIiOiIyMzFmY2ExZS04ZWY1LTQ4NzAtYjQ3Yy1lYjY1NTljMWIyNWIiLCJyb2xlIjoiT3duZXIiLCJpYXQiOjE3MzM1OTMwNzYsImV4cCI6MTczMzc2NTg3Nn0.hEkJsbFKCYHbYImHI9jj4xkMGp6QAOqeN4bQ-XGeQto";
const UserPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState({
    first: "",
    last: "",
    userid: "",
    password: "",
    type: "",
  });

  useEffect(() => {
    getUsers();
  }, []);

  const handleFormState = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
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
    handleFormState("pasdword", "");
    setUpdateId("");
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleOpenDeletePopup = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setUserToDelete(null);
    setShowDeletePopup(false);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      id: isEditing ? selectedUser.id : users.length + 1,
      name: formData.get("name"),
      xdsNumber: formData.get("xdsNumber"),
      userType: formData.get("userType"),
    };

    if (isEditing) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? userData : user))
      );
    } else {
      setUsers([...users, userData]);
    }

    handleCloseModal();
  };

  // ************************API's START************************
  const createUsers = async () => {
    let body = {
      firstName: formState.first,
      lastName: formState.last,
      email: formState.userid,
      password: formState.password,
      role: formState.type,
    };

    let headers = {
      Authorization: "Bearer " + token,
    };

    try {
      let response = await apiHelper.post("/users", body, headers);
      getUsers();
    } catch (err) {
      console.error("Error creating users:", err);
    }
  };

  const getUsers = async () => {
    let headers = {
      Authorization: "Bearer " + token,
    };

    try {
      let response = await apiHelper.get("/users", {}, headers);

      setUsers(response?.data);

      console.log("users", response);
    } catch (err) {
      console.error("Error creating users:", err);
    }
  };

  const updateUsers = async () => {
    let body = {
      password: formState.password,
      // email: formState.userid,
      role: formState.type,
    };
    let headers = {
      Authorization: "Bearer " + token,
    };

    try {
      let response = await apiHelper.patch(`/users/${updateId}`, body, headers);
      getUsers();
      console.log("users", response);
    } catch (err) {
      console.error("Error updating users:", err);
    }
  };

  const deleteUser = async () => {
    let headers = {
      Authorization: "Bearer " + token,
    };
    try {
      let response = await apiHelper.del(`/users/${updateId}`, headers, {});
      getUsers();
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
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-plus-circle me-2"></i> Add User
      </button>

      {/* User Table */}
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
            users.map((user, index) => (
              <tr key={user?.id}>
                <td>{index + 1}</td>
                <td>{`${user?.firstName} ${user?.lastName}`}</td>
                <td>{user?.email}</td>
                <td>{user?.role}</td>
                <td>
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
                </td>
              </tr>
            ))
          ) : (
            <span>No Data Found!</span>
          )}
        </tbody>
      </table>

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
                  />
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
                  />
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
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
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
                  className="btn btn-primary"
                  onClick={isEditing ? updateUsers : createUsers}
                >
                  Save
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
                <button className="btn btn-danger" onClick={deleteUser}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
