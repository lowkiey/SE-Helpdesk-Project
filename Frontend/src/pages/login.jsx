import "../stylesheets/auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

let backend_url = "http://localhost:3000/api/v1";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(""); // State to hold OTP value
  const [error, setError] = useState(""); // State to hold error message


  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data)
        if (response.data.user.mfa) {
          // If MFA is enabled, display OTP input modal
          setShowOtpInput(true);
          return;
        } else {
          localStorage.setItem("userId", response.data.user._id)
          //
          localStorage.setItem("role", response.data.user.role)
          //
          localStorage.setItem("name", response.data.user.displayName)
          //
          localStorage.setItem("email", response.data.user.email)
          //

          const user = response.data.user
          localStorage.setItem("token", response.data.token)
          console.log(response.data.token)
          // if (user.role === "user") {
          navigate("/home");
          // }
          console.log(response.data)
        }

      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 404) {
          setError("Email Not Found.");
        } else if (error.response.status === 405) {
          setError("Incorrect password.");
        }
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/login/verify`, // Use the verify endpoint
        {
          email,
          otp,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("userId", response.data.user._id)
        //
        localStorage.setItem("role", response.data.user.role)
        //
        localStorage.setItem("name", response.data.user.displayName)
        //
        localStorage.setItem("email", response.data.user.email)
        //

        const user = response.data.user
        localStorage.setItem("token", response.data.token)
        console.log(response.data.token)
        // if (user.role === "user") {
        navigate("/home");
        // }
        console.log(response.data)

      }
    } catch (error) {
      console.error(error);

    }
  };
  return (
    <div className="form_container" style={{ marginLeft: "35%", marginTop: "5%" }} >
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <span className="error-message">{error}</span>} {/* Display error message */}

      {showOtpInput && ( // Display OTP input modal conditionally
        <div className="otp-modal">
          <form onSubmit={handleOtpSubmit}>
            <h3>Enter OTP</h3>
            <input
              type="text"
              name="otp"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit">Verify OTP</button>
          </form>
        </div>
      )}

      <span>
        {/* Error or success messages */}
      </span>
      <span>
        Already have an account? <Link to={"/register"}>Signup</Link>
      </span>
    </div>
  );
};

export default Login;
