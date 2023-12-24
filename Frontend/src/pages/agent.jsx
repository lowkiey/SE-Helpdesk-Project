import React, { useEffect, useState } from "react";
// import AppNavBar from "../components/navbar";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import styled, { createGlobalStyle } from 'styled-components';


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
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    const handleToggleChange = () => {
        toggleTheme();
    };



    // Light Mode styles
    const LightMode = styled.div`
  background-color: white;
    color: black;
`;

    // Dark Mode styles
    const DarkMode = styled.div`
  background-color: #0d001a;
  color: white;

  .toggle-container {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }

  .toggle-label {
    margin-right: 10px;
  }

  .toggle {
    appearance: none;
    width: 50px;
    height: 25px;
    background-color: #777;
    border-radius: 25px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;
  }

  .toggle::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
  }

  .toggle:checked {
    background-color: #52d869; /* Change color to match your theme */
  }

  .toggle:checked::before {
    transform: translateX(25px) translateY(-50%);
  }
`;
    const handleUserIconClick = () => {
        setIsUserTabOpen(!isUserTabOpen);
    };
    async function fetchNotifications() {
        try {
            const userEmail = localStorage.getItem("email");
            console.log(userEmail);
            const response = await axios.get(`${backend_url}/notification/?email=${userEmail}`, { withCredentials: true, });
            setNotifications(response.data.notificationsCombined);
            console.log("response", response.data);
            return response.data; // Assuming the response contains an array of notifications
        } catch (error) {
            console.log("Error fetching notifications:", error.response); // Log the error response
            return []; // Return an empty array if there's an error
        }
    }
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
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
        fetchNotifications()


    }, [cookies.token, navigate, showNotification]);

    return (
        <>

            {theme === 'light' ? (
                <LightMode>
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
                                    <Nav.Link as={Link} to="/agent" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple' }}>
                                        HelpDesk
                                    </Nav.Link>
                                   
                                </Nav>
                                <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>

                                    <Nav.Item>
                                        <div style={{ position: 'relative' }}>
                                            <FaBell
                                                onClick={() => setShowNotification(!showNotification)}
                                                style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '20px' }}
                                            />
                                            {showNotification && (
                                                <div style={{ position: 'absolute', top: '30px', right: '20px', width: '300px', maxHeight: '400px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px', overflowY: 'auto' }}>
                                                    {/* notification tab content */}
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '20px' }}>Notifications:</p>
                                                        <ul style={{ listStyleType: 'none', padding: '0', maxHeight: '300px', overflowY: 'auto', marginTop: '5px' }}>
                                                            {notifications.length === 0 ? (
                                                                <li>
                                                                    <p style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center', color: 'purple', marginTop: '20px' }}>No notifications</p>
                                                                </li>
                                                            ) : (
                                                                notifications.map(notification => (
                                                                    <li key={notification._id}>
                                                                        <p>From: {notification.from}</p>
                                                                        <p>{notification.text}</p>
                                                                        <hr style={{ margin: '5px 0' }} />
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <div style={{ position: 'relative' }}>
                                            <FaUser
                                                onClick={handleUserIconClick}
                                                style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '20px' }}
                                            />
                                            {/* User tab content */}
                                            <div style={{ position: 'absolute', top: '35px', right: '-150px', width: '200px', height: '150px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                    <p style={{ margin: '10px', fontSize: '20px', fontWeight: 'bold' }}>{`${userName}`}</p>
                                                    {/* Toggle switch for both modes */}
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ marginRight: '10px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                                <span>Dark Mode</span>
                                                            </span>
                                                        </div>

                                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '80px', height: '25px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                            <input
                                                                className="toggle"
                                                                type="checkbox"
                                                                checked={theme === 'dark'}
                                                                onChange={toggleTheme}
                                                                style={{ display: 'none' }}
                                                            />
                                                            <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: '#ccc', width: '50px', borderRadius: '25px', transition: 'background-color 0.3s ease' }}></span>
                                                            <span className="slider-thumb" style={{ position: 'absolute', cursor: 'pointer', top: '3px', left: theme === 'light' ? '3px' : '53px', width: '19px', height: '19px', backgroundColor: 'white', borderRadius: '50%', transition: 'transform 0.3s ease' }}></span>
                                                        </label>
                                                    </div>
                                                    <Link to="/" style={{ marginTop: '10px', color: 'rgb(209, 151, 240)', textDecoration: 'none', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>Logout</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Nav.Item>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <h1 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
                        {`Hello ${userName}, This is the Agent's Page?`} {/* by3rfni 3aleh w y2oli ezayik ya latifa */}
                    </h1>
                    
                    {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="create" onClick={() => navigate("/tickets")} style={{ fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Create a new support ticket</button>
            <button className="activity" onClick={() => navigate("/tickets")} style={{ marginTop: '25px', fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Recent Activity</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <img
              src="/gg.jpg"
              alt="Image Description"
              style={{ width: '25%', height: '25%' }}
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
          </div> */}
                </LightMode>
            ) : (
                <DarkMode>
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
                                    <Nav.Link as={Link} to="/agent" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple' }}>
                                        HelpDesk
                                    </Nav.Link>
                                    
                                </Nav>
                                <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>

                                    <Nav.Item>
                                        <div style={{ position: 'relative' }}>
                                            <FaBell
                                                onClick={() => setShowNotification(!showNotification)}
                                                style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '20px' }}
                                            />
                                            {showNotification && (
                                                <div style={{ position: 'absolute', top: '30px', right: '20px', width: '300px', maxHeight: '400px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px', overflowY: 'auto' }}>
                                                    {/* notification tab content */}
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '20px', color: 'black' }}>Notifications:</p>
                                                        <ul style={{ listStyleType: 'none', padding: '0', maxHeight: '300px', overflowY: 'auto', marginTop: '5px', color: 'black' }}>
                                                            {notifications.length === 0 ? (
                                                                <li>
                                                                    <p style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center', color: 'purple', marginTop: '20px' }}>No notifications</p>
                                                                </li>
                                                            ) : (
                                                                notifications.map(notification => (
                                                                    <li key={notification._id}>
                                                                        <p>From: {notification.from}</p>
                                                                        <p>{notification.text}</p>
                                                                        <hr style={{ margin: '5px 0' }} />
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <div style={{ position: 'relative' }}>
                                            <FaUser
                                                onClick={handleUserIconClick}
                                                style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '20px' }}
                                            />
                                            {/* User tab content */}
                                            <div style={{ position: 'absolute', top: '35px', right: '-150px', width: '200px', height: '150px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                    <p style={{ margin: '10px', fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{`${userName}`}</p>
                                                    {/* Toggle switch for both modes */}
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ color: 'black', marginRight: '10px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                                <span>Light Mode</span>
                                                            </span>
                                                        </div>
                                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '80px', height: '25px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                                            <input
                                                                className="toggle"
                                                                type="checkbox"
                                                                checked={theme === 'dark'}
                                                                onChange={toggleTheme}
                                                                style={{ display: 'none' }}
                                                            />
                                                            <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: '#ccc', width: '50px', borderRadius: '25px', transition: 'background-color 0.3s ease' }}></span>
                                                            <span className="slider-thumb" style={{ position: 'absolute', cursor: 'pointer', top: '3px', left: theme === 'light' ? '3px' : '28px', width: '19px', height: '19px', backgroundColor: 'white', borderRadius: '50%', transition: 'transform 0.3s ease' }}></span>
                                                        </label>
                                                    </div>
                                                    <Link to="/" style={{ marginTop: '10px', color: 'rgb(209, 151, 240)', textDecoration: 'none', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>Logout</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Nav.Item>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <h1 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
                        {`Hello ${userName}, This is the Agent's Page?`} {/* by3rfni 3aleh w y2oli ezayik ya latifa */}
                    </h1>

                    {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="create" onClick={() => navigate("/tickets")} style={{ fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Create a new support ticket</button>
            <button className="activity" onClick={() => navigate("/tickets")} style={{ marginTop: '25px', fontFamily: "sans-serif", fontWeight: "bold", backgroundColor: 'purple', color: 'white', border: 'white', borderRadius: '5px', width: '15%', padding: '8px', }}>Recent Activity</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <img
              src="/gg.jpg"
              alt="Image Description"
              style={{ width: '25%', height: '25%' }}
            />
          </div>
          <div className="about us">
            <h1 style={{ textAlign: "left", marginTop: '90px', color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold", marginLeft: '35px', marginRight: 'auto', width: 'fit-content' }}>
              About Us
            </h1>
            <p style={{ textAlign: "left", marginTop: '10px', marginLeft: "15px", color: 'white', fontFamily: "Sans-Serif", fontWeight: "bold", width: '1500px', padding: '20px' }}>
              Our mission at Helpdesk is to revolutionize support services through our cutting-edge ticketing system. We are dedicated to streamlining communication between users and support teams, ensuring swift and efficient resolution of issues. Our commitment lies in empowering both clients and businesses by providing a seamless, user-friendly platform that fosters clarity, transparency, and satisfaction. We strive to be the catalyst for exceptional customer experiences, offering reliable solutions that elevate the standards of support services in the digital age.
            </p>
            <h1 style={{ textAlign: "left", marginTop: '20px', color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold", marginLeft: '35px', marginRight: 'auto', width: 'fit-content' }}>
              Our Services
            </h1>
            <p style={{ textAlign: "left", marginTop: '10px', marginLeft: "15px", color: 'white', fontFamily: "Sans-Serif", fontWeight: "bold", width: '1500px', padding: '20px' }}>
              Our services are tailored to provide efficient solutions for your needs. Need help? Simply open a ticket with us, and rest assured that a specialized agent, skilled in hardware, software, or network-related issues, will promptly address your concern. Our priority ticketing system ensures that urgent matters receive immediate attention, while our live chat functionality enables real-time communication for quick resolutions. Experience reliable support catered specifically to your technical requirements, making your experience with us smooth and hassle-free.
            </p>
          </div> */}
                </DarkMode>
            )}



        </>
    );
}