import "../stylesheets/auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
await axios.post
const backendUrl = "http://localhost:3000/api/v1/register";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl,
        {
          email,
          password,
          displayName: username,
          role: "user",
        },
        { withCredentials: true }
      );

      const { status } = response;
      if (status === 201) {
        console.log("hi");
        setSuccessMessage("Sign up successful!");
        setInputValue({
          email: "",
          password: "",
          username: "",
          role: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form_container" style={{ marginLeft: "35%", marginTop: "5%", backgroundColor: "white" }}>
      <h2>Signup Account</h2>
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
          <label htmlFor="email">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
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
        <button type="submit">Submit</button>
        <span>
          {errorMessage} {successMessage}
        </span>
        <span>
          Already have an account? <Link to={"/"}>Login</Link>
        </span>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Signup;