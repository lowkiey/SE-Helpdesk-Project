import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import { useCookies } from "react-cookie";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

let backend_url = "http://localhost:3000/api/v1";

export default function IssuePage() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [userName, setUserName] = useState("");
    const [isUserTabOpen, setIsUserTabOpen] = useState(false);
    const [issues, setIssues] = useState([]);
    const [chartData, setChartData] = useState(null);
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

    const handleUserIconClick = () => {
        setIsUserTabOpen(!isUserTabOpen);
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
        async function fetchIssues() {
            try {
                console.log("hi tots");
                const response = await axios.get(`${backend_url}/issues`, {
                    withCredentials: true,
                });
                setChartData(response.data); // Assuming the response contains the counts data
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }

        fetchIssues();
        fetchUserData();
    }, [cookies.token, navigate], showNotification);

    return (
        <>
            <GlobalStyle theme={theme} />
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
                            <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple' }}>
                                HelpDesk
                            </Nav.Link>

                            <Nav.Link as={Link} to="/reports" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                Reports
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
                                                    <div>
                                                        <label className="toggle-container">
                                                            <span className="toggle-label" style={{ color: theme === 'dark' ? 'black' : 'black' }}>
                                                                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                                            </span>
                                                        </label>
                                                    </div>
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
            <h1 style={{ color: 'purple', textAlign: 'center' }}>Reports Charts </h1>
            <div className="chart-container" style={{ border: '10px solid purple', borderRadius: '20px', padding: '20px' }}>
                {chartData ? (
                    <Bar
                        data={{
                            labels: Object.keys(chartData), // Use category names as labels
                            datasets: [
                                {
                                    label: 'Categories Count',
                                    data: Object.values(chartData).map(category => category.total), // Use the 'total' property for data
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                ) : (
                    <p>hi</p>
                )}
            </div>
            {chartData && chartData.Hardware && (
                <div className="chart-container" style={{ border: '10px solid purple', borderRadius: '20px', padding: '20px' }}>
                    <Bar
                        data={{
                            labels: Object.keys(chartData.Hardware).filter(key => key !== 'total'),
                            datasets: [
                                {
                                    label: 'Hardware Subcategories Count',
                                    data: Object.values(chartData.Hardware).slice(0, -1),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            )}

            {/* Software chart */}
            {chartData && chartData.Software && (
                <div className="chart-container" style={{ border: '10px solid purple', borderRadius: '20px', padding: '20px' }}>
                    <Bar
                        data={{
                            labels: Object.keys(chartData.Software).filter(key => key !== 'total'),
                            datasets: [
                                {
                                    label: 'Software Subcategories Count',
                                    data: Object.values(chartData.Software).slice(0, -1),
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            )}

            {/* Network chart */}
            {chartData && chartData.Network && (
                <div className="chart-container" style={{ border: '10px solid purple', borderRadius: '20px', padding: '20px' }} >
                    <Bar
                        data={{
                            labels: Object.keys(chartData.Network).filter(key => key !== 'total'),
                            datasets: [
                                {
                                    label: 'Network Subcategories Count',
                                    data: Object.values(chartData.Network).slice(0, -1),
                                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            )}
        </>
    );
}