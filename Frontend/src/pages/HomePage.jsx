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
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
          navigate("/");
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
        // const response = await axios.get(`${backend_url}/users/${uid}`, {
        //   withCredentials: true,
        // });

        // Assuming the user's display name is fetched from response.data.displayName
        // setUserName(response.data.displayName);

        // Assuming chats are fetched from response.data.chats
        // setChats(response.data.chats);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/"); // Redirect to login page on error
      }
    }

    fetchUserData();
  }, [cookies.token, navigate]);

  return (
    <>
      <AppNavBar />
      <h1 style={{ textAlign: "center", margin: "30px", color: 'black' }}>
        Hello {userName}
      </h1>

      <h2 style={{ textAlign: "center", margin: "20px", color: 'black' }}>
        Chats
      </h2>

      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>{chat.name}</li>
        ))}
      </ul>
    </>
  );
}
