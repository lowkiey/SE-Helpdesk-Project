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
const backend_url = "http://localhost:3000/api/v1";

export default function Chat() {
    const navigate = useNavigate();
    const [cookies] = useCookies([]);
    const [userName, setUserName] = useState("");
    const [users, setUsers] = useState([]);
    const [isUserTabOpen, setIsUserTabOpen] = useState(false)
    const [showNotification, setShowNotification] = useState(false); // New state for notification
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState("light");
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userId, setUserId] = useState(""); // New state to hold the user ID
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    const handleToggleChange = () => {
        toggleTheme();
    };
    const GlobalStyle = createGlobalStyle`
    body {
      background-color: ${(props) => (props.theme === 'dark' ? '#0d001a' : 'white')};
      color: ${(props) => (props.theme === 'dark' ? 'white' : 'black')};
      margin: 0;
      padding: 0;
      transition: all 0.3s ease; /* Optional: Smooth transition */
    }
  `;
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

        async function fetchAvailableUsers() {
            try {
                const response = await axios.get(`${backend_url}/users/availableUsers`, {
                    withCredentials: true,
                });
                console.log("Available users:", response.data.availableUser)
                setAvailableUsers(response.data.availableUser); // Assuming the response contains an array of user objects
            } catch (error) {
                console.log("Error fetching available users:", error);
                // Handle error accordingly
            }
        };

        async function fetchUserData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token found, redirecting to login");
                    navigate("/");
                    return;
                }

                const uid = localStorage.getItem("userId");
                const response = await axios.get(`${backend_url}/users/${uid}`, {
                    withCredentials: true,
                });
                setUserName(response.data.displayName);
                setUserId(uid); // Set the user ID state
            } catch (error) {
                console.log("Error fetching user data:", error);
                navigate("/");
            }
        }

        fetchUserData();
        fetchNotifications()
        fetchAvailableUsers();
    }, [navigate], showNotification, navigate);

    const handleSelectUser = (userId) => {
        navigate(`/chats/${userId}`); // Navigate to chat page with the selected user ID
    };

    return (
        <>
            <GlobalStyle theme={theme} />

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
                                           
                                            <Link to="/" style={{ marginTop: '10px', color: 'rgb(209, 151, 240)', textDecoration: 'none', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>Logout</Link>
                                        </div>
                                    </div>
                                </div>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <h1 style={{ color: 'purple', marginLeft: '55vh' }}>Available Chats</h1>
            <div className="table-container" style={{ maxWidth: '1000px', marginTop: '90px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                <table className="table table-striped" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead style={{ backgroundColor: 'purple', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid white', borderRight: '1px solid purple', borderTop: '1px solid purple', borderLeft: '1px solid purple', borderRadius: '8px 0 0 0' }}>#</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid white', borderRight: '1px solid purple', borderTop: '1px solid purple', borderLeft: '1px solid purple' }}>Display Name</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid white', borderTop: '1px solid purple', borderLeft: '1px solid purple', borderRight: '1px solid purple', borderRadius: '0 8px 0 0' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableUsers.map((availableUser, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid purple' }}>
                                <td style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid purple', borderLeft: '1px solid purple' }}>{availableUser._id}</td>
                                <td style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid purple', borderLeft: '1px solid purple' }}>{availableUser.displayName}</td>
                                <td style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid purple', borderLeft: '1px solid purple' }}>
                                    <button
                                        className="btn btn-primary start-chat-btn"
                                        onClick={() => handleSelectUser(availableUser._id)}
                                        style={{ backgroundColor: 'purple', border: '1px solid purple', color: 'white', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}
                                    >
                                        Start Chat
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



        </>
    );
}
