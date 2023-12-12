import "../stylesheets/auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backend_url = "http://localhost:3000/api/v1";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(""); // State to hold OTP value

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
        setShowOtpInput(true); // Display OTP input modal
      }
    } catch (error) {
      console.error(error);
      // Handle errors
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
        localStorage.setItem("userId", response.data.user._id);
        const user = response.data.user;
        if (user.role === "user") {
          navigate("/home");
        }
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
      // Handle errors
    }
  };

  return (
    <div className="form_container" style={{ marginLeft: "35%", marginTop: "5%" }}>
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
        <button type="submit">Get OTP</button>
      </form>

      {showOtpInput && (
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

      <span>{/* Error or success messages */}</span>
      <span>
        Already have an account? <Link to={"/register"}>Signup</Link>
      </span>
    </div>
  );
};

export default Login;
