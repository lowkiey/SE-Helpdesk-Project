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
  const [notifications, setNotifications] = useState([]);


  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
  async function fetchNotifications() {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.get(`${backend_url}/notification/?email=${userEmail}`);
      return response.data; // Assuming the response contains an array of notifications
    } catch (error) {
      console.log("Error fetching notifications:", error.response); // Log the error response
      return []; // Return an empty array if there's an error
    }
  }
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
          // navigate("/");
          return; // Exit early if there's no token
        }


        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);

        setUserName(response.data.displayName);      //di btgib el esm lw 3aiza 7aga tani b3d kda b3mlha display
        } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/"); // Redirect to login page on error
      }
    }

    fetchUserData();
    
    if (showNotification) {
      fetchNotifications().then(data => {
        setNotifications(data);
      });
    }
  
  }, [cookies.token, navigate,showNotification]);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
              <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple' }}>
                HelpDesk
              </Nav.Link>
              <Nav.Link as={Link} to="/tickets" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                Tickets
              </Nav.Link>
              <Nav.Link as={Link} to="/faq" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
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
                    style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '20px' }}
                  />
                  {showNotification && (
                    <div style={{ position: 'absolute', top: '30px', right: '20px', width: '200px', height: '300px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}>
                      {/* notification tab content */}
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '20px' }}>Notifications:</p>
                        {notifications.map(notification=>(
                           <div key={notification.id}>
                           <p>From: {notification.from}</p>
                           <p>{notification.text}</p>
                           <hr style={{ margin: '5px 0' }} />
                         </div>
                          
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Nav.Item>
              <Nav.Item>
                <div style={{ position: 'relative' }}>
                  <FaUser
                    onClick={handleUserIconClick}
                    style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '-40px' }}
                  />
                  {isUserTabOpen && (
                    <div style={{ position: 'absolute', top: '30px', right: '-200px', width: '200px', height: '100px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px' }}>
                      {/* User tab content */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <div style={{ marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}> */}
                          {/* Placeholder image */}
                          {/* <img src="https://via.placeholder.com/50" alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> */}
                        {/* </div> */}
                        <div>
                          <p style={{ margin: '10px', fontSize:'20px', fontWeight: 'bold', marginTop: '-0.5vh ' }}>{`hello ${userName}`}</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button className="create" onClick={() => navigate("/tickets")} style={{ fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Create a new support ticket</button><button className="activity" onClick={() => navigate("/tickets")} style={{ marginTop: '25px', fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Recent Activity</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
    <img
    src="Frontend/public/gg.jpg"
    alt="Image Description"
  />
    </div>
      <div className="about us">
        <h1 style={{ textAlign: "left", marginTop: '90px', color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold", marginLeft: '35px', marginRight: 'auto', width: 'fit-content' }}>
          About Us
        </h1>
        <p style={{ textAlign: "left", marginTop: '10px', marginLeft: "15px", color: 'black', fontFamily: "Sans-Serif", fontWeight: "bold", width: '1500px', padding: '20px' }}>
          Our mission at Helpdesk is to revolutionize support services through our cutting-edge ticketing system. We are dedicated to streamlining communication between users and support teams, ensuring swift and efficient resolution of issues. Our commitment lies in empowering both clients and businesses by providing a seamless, user-friendly platform that fosters clarity, transparency, and satisfaction. We strive to be the catalyst for exceptional customer experiences, offering reliable solutions that elevate the standards of support services in the digital age.
        </p>
        <h1 style={{ textAlign: "left", marginTop: '20px', color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold", marginLeft: '35px', marginRight: 'auto', width: 'fit-content' }}>
          Our Services
        </h1>
        <p style={{ textAlign: "left", marginTop: '10px', marginLeft: "15px", color: 'black', fontFamily: "Sans-Serif", fontWeight: "bold", width: '1500px', padding: '20px' }}>
        Our services are tailored to provide efficient solutions for your needs. Need help? Simply open a ticket with us, and rest assured that a specialized agent, skilled in hardware, software, or network-related issues, will promptly address your concern. Our priority ticketing system ensures that urgent matters receive immediate attention, while our live chat functionality enables real-time communication for quick resolutions. Experience reliable support catered specifically to your technical requirements, making your experience with us smooth and hassle-free.
        </p>
      </div>


    </>
  );
}