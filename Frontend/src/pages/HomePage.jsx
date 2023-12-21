import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  const [isUserTabOpen, setIsUserTabOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // State for tracking the selected option
  let radio = false;

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleStartChat = () => {
    
   navigate('./chat.jsx');



  };

  useEffect(() => {
     
  // const role = localStorage.getItem("role");
  // console.log(role);
  //   if(role === 'agent'){
  //     radio = false;
  //     }
  //   else{
  //     radio = false;
  //   }



    async function fetchUserData() {
      




      try {
        const role = localStorage.getItem("role");
        console.log(role);
         if(role === 'agent'){
         radio = false;
                      }
    else{
      radio = true;
    }
    
       if (!cookies.token) {
          console.log("No token found, redirecting to login");
          // navigate("/");
          return; // Exit early if there's no token
        }

        // const uid = localStorage.getItem("userId");
        // const response = await axios.get(`${backend_url}/users/${uid}`, {
        //   withCredentials: true,
        // });

        // setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        // navigate("/"); // Redirect to login page on error
      }
    }

    fetchUserData();
  }, [cookies.token, navigate]);

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
              <Nav.Link as={Link} to="/tickets" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                Tickets
              </Nav.Link>
              
              <Nav.Link as={Link} to="/faq" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                FAQs
              </Nav.Link>

              <Nav.Link as={Link} to="/chats" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                my chats
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FaBell
                  onClick={() => setShowNotification(!showNotification)}
                  style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginRight: '20px' }}
                />
                {showNotification && (
                  <div style={{ position: 'absolute', top: '30px', right: '20px', width: '200px', height: '300px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}>
                    {/* notification tab content */}
                    <div>
                      <p style={{ margin: '0', fontWeight: 'bold', fontSize: '20px' }}>Notifications:</p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <FaUser
                  onClick={handleUserIconClick}
                  style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginRight: '-40px' }}
                />
                {isUserTabOpen && (
                  <div style={{ position: 'absolute', top: '30px', right: '-200px', width: '200px', height: '100px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px' }}>
                    {/* User tab content */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}>
                        {/* Placeholder image */}
                        <img src="https://via.placeholder.com/50" alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold', marginTop: '0' }}>{userName}</p>
                        <br />
                        <Link to="/" style={{ color: 'rgb(209, 151, 240)', textDecoration: 'none' }}>Logout</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
        {`Hello ${userName}, What are you trying to do today?`} {/* Displaying the username */}
      </h1>

      {/* Radio buttons for options */}
      
      <div className={ radio? 'hidden': undefined} style={{ textAlign: "center", marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            value="hardware"
            checked={selectedOption === "hardware"}
            onChange={() => handleOptionChange("hardware")}
          />
          Hardware
        </label>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            value="software"
            checked={selectedOption === "software"}
            onChange={() => handleOptionChange("software")}
          />
          Software
        </label>
        <label>
          <input
            type="radio"
            value="network"
            checked={selectedOption === "network"}
            onChange={() => handleOptionChange("network")}
          />
          Network
        </label>
      </div>

      {/* Button to start the chat */}
      <button  className={ radio? 'hidden': undefined} onClick={handleStartChat} style={{ marginBottom: "20px", fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px' }}>Start Chat</button>

      {/* ... (existing code) */}

      <div className="about us">
        <h1 style={{ textAlign: "center", marginTop:'90px',marginRight: "1650px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold"}}>
          About Us  </h1>
        <p style={{ textAlign: "center", marginTop:'90px',marginRight: "1650px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold", width: '1500px', padding: '20px'}}> 
          Our mission at Helpdesk is to revolutionize support services through our cutting-edge ticketing system. We are dedicated to streamlining communication between users and support teams, ensuring swift and efficient resolution of issues. Our commitment lies in empowering both clients and businesses by providing a seamless, user-friendly platform that fosters clarity, transparency, and satisfaction. We strive to be the catalyst for exceptional customer experiences, offering reliable solutions that elevate the standards of support services in the digital age.
        </p>
      </div>
    </>
  );
}
