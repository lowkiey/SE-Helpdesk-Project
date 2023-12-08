import React, { useEffect, useState } from "react";
import AppNavBar from "../components/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/esm/Container";
let backend_url = "http://localhost:3000/api/v1/tickets";

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
          // const response = await axios.get(`${backend_url}/users/${uid}`, {
          //   withCredentials: true,
          // });
  
          // Assuming the user's display name is fetched from response.data.displayName
          // setUserName(response.data.displayName);
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
        <Container>
        <h1 style={{ textAlign: "center", margin: "30px", color: 'Purple' }}>
          Hello {userName}, What are you trying to do today?
        </h1>
        <br></br>
        <button style={{ marginLeft: '550px', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none', border: 'white' }}>Create Ticket</button>
        <br></br>
        <button style={{ marginLeft: '550px', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none', border: 'white' }}>Previous Tickets</button>
        <br></br>
        <button style={{ marginLeft: '550px', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none', border: "white" }}>Browse All Categories</button>
        
        </Container>
        
      </>
    );
  }