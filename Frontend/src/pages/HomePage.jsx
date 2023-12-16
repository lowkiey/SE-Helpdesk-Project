import React, { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import axios from "axios";
import Chat from "../components/chat"; // Replace with the correct path


let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Include your token logic here
        // const token = cookies.token;
        // if (!token) {
        //   console.log("No token found, redirecting to login");
        //   navigate("/");
        //   return;
        // }

        // Replace with your user data fetching logic
        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
          // headers: { Authorization: `Bearer ${token}` }, // Uncomment if using token
        });

        setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        // Redirect to login page or handle the error accordingly
        // navigate("/");
      }
    }

    fetchUserData();
  }, []); // Empty dependency array to run only once on mount

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };

  const handleChatButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
  };

  
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
              <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}>
                HelpDesk
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Item>
                <FaUser
                  onClick={handleUserIconClick}
                  style={{ position: 'inherit', top: '15px', right: '60px', fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}
                />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {isUserTabOpen && (
          <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 100, backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}>
            {/* User tab content */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}>
                {/* Placeholder image */}
                <img src="https://via.placeholder.com/50" alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>User Name</p>
                <Link to="/" style={{ color: 'rgb(209, 151, 240)', textDecoration: 'none' }}>Logout</Link>
              </div>
            </div>
          </div>
        )}
      </Navbar>





{/* Add the Chat component here */}
<Chat />








      <h1 style={{ textAlign: "left", margin: "40px", color: 'black', fontFamily: "Times New Roman", fontWeight: "bold" }}>
        {` ${userName}`} {/* Displaying the username */}
      </h1>
    </>
  );
}
