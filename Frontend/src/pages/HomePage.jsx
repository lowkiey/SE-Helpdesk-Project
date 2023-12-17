import React, { useEffect, useState } from "react";
// import AppNavBar from "../components/navbar";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';


import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false); // New state for notification

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
          //navigate("/");
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);

        setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        //navigate("/"); // Redirect to login page on error
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
              </Nav>
              <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
                {/* User Icon */}

                {/* Notification Icon */}
                <Nav.Item>
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
                </Nav.Item>
                <Nav.Item>
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
                            <p style={{ margin: '0', fontWeight: 'bold', marginTop: '0' }}>User Name</p>
                            <br />
                            <Link to="/" style={{ color: 'rgb(209, 151, 240)', textDecoration: 'none' }}>Logout</Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Nav.Item>
              </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
        {`Hello ${userName}, What are you trying to do today?`} {/* Displaying the username */}
      </h1>

      <button className="create"  onClick={() => navigate("/tickets")} style={{marginLeft: '800px' ,fontFamily: "sans-serif",fontWeight:"bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px',}}>Create a new support ticket</button>
      <button className="activity" onClick={() => navigate("/tickets")} style={{marginLeft: '800px' , marginTop: '25px', fontFamily: "sans-serif",fontWeight:"bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px',}}>Recent Activity</button>

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