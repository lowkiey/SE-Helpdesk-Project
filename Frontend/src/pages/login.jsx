import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie"; // Import useCookies
import "../stylesheets/auth.css";

let backend_url = "http://localhost:3000/api/v1";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { email, password } = inputValue;
  const [cookies, setCookie] = useCookies(["token"]); // Use cookies hook

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
      const { status, data } = response;
      if (status === 200) {
        // Handle successful login
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("role", data.user.role);
        setCookie("token", data.token); // Set the token in cookies
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred while logging in.");
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="form_container" style={{ marginLeft: "35%", marginTop: "5%", backgroundColor: "white" }}>
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
        <button type="submit">Submit</button>
        <span>{errorMessage} {successMessage}</span>
        <span>Already have an account? <Link to={"/register"}>Signup</Link></span>
      </form>
    </div>
  );
};

export default Login;