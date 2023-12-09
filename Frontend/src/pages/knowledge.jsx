import React, { useEffect, useState } from "react";
import AppNavBar from "../components/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
        const response = await axios.get(`${backend_url}/users/${uid}`, {
         withCredentials: true,
      });

        // Assuming the user's display name is fetched from response.data.displayName
        setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/login"); // Redirect to login page on error
      }
    }

    fetchUserData();
  }, [cookies.token, navigate]);

  return (
    <>
      <AppNavBar />
      <h1 style={{ textAlign: "center", margin: "30px", color: 'white' }}>
        Hello {userName}
      </h1>

      <section style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
        <h2>Frequently Asked Questions (FAQs)</h2>
        <div>
          <h3>Q: What is this website about?</h3>
          <p>A: Provide a brief description of your website and its purpose.</p>
        </div>
        <div>
          <h3>Q: How do I get started?</h3>
          <p>A: Include instructions or a link to a guide on getting started.</p>
        </div>
        {/* Add more FAQs as needed */}
      </section>
    </>
  );
}
