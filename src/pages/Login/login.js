import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../../assets/logo.jpeg";
import apiHelper from "../../utils/apiHelper/apiHelper";
import ButtonLoader from "../../components/Loader/buttonLoader";

const Login = () => {
  // State for email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = {
      email: email,
      password: password,
    };
    console.log("body", body);
    setBtnLoader(true);
    try {
      let res = await apiHelper.post("/auth/login", body, {});
      if (res?.accessToken) {
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("role", res?.user?.role);

        setTimeout(() => {
          setBtnLoader(false);
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setTimeout(() => {
          setError("Invalid credentials");
          setBtnLoader(false);
        }, 1000);
      }
    } catch (error) {
      window.alert("Something went wrong");
      setBtnLoader(false);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src={logo} className="img-fluid" alt="Sample image" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
              </div>

              <div
                data-mdb-input-init
                className="form-outline mb-3 position-relative"
              >
                <div className={`d-flex align-items-center gap-2`}>
                  <input
                    type={showPassword ? "text" : "password"} // Toggle input type
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className={`password__input`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </span>
                </div>

                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
                {/* Eye Icon for toggling visibility */}
              </div>

              {/* <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">
                  Forgot password?
                </a>
              </div> */}

              {/* Display error message if credentials are incorrect */}
              {error && <p className="text-danger text-center">{error}</p>}

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-lg"
                  style={{
                    backgroundColor: "#9acb3b",
                    border: "none",
                  }}
                >
                  {btnLoader ? <ButtonLoader /> : "Login"}
                </button>
                {/* <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <a href="#!" className="link-danger">
                    Register
                  </a>
                </p> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2024. All rights reserved by XOOM DELIVERY.
        </div>

        <div>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-google"></i>
          </a>
          <a href="#!" className="text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;
