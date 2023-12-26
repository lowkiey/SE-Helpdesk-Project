import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import { FaBell } from 'react-icons/fa';


let backend_url = "http://localhost:3000/api/v1";

export default function UpdateTickets() {
    const navigate = useNavigate();
    const [cookies] = useCookies([]);
    const [tickets, setTickets] = useState([]);
    const [userName, setUserName] = useState("");
    const [isUserTabOpen, setIsUserTabOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [solution, setSolution] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const handleUpdateClick = (ticket) => {
        setSelectedTicketId(ticket._id); // Store the ID of the selected ticket
        setSelectedTicket(ticket); // Store the entire selected ticket
        setShowPopup(true);
    };

    const handleSaveClick = async () => {
        try {
            if (!selectedTicketId || !solution) {
                console.error('Ticket ID or Solution is missing');
                return;
            }
            console.log('Updating ticket:', selectedTicket._id);
            console.log('Solution:', solution)
            const updatedTicket = { ...selectedTicket, solution }; // Update the selected ticket with the solution
            const response = await axios.put(`${backend_url}/tickets/${selectedTicket._id}`, updatedTicket,
                { withCredentials: true });

            console.log('Ticket updated:', response.data);
            setSelectedTicket(null);
            setSolution('');
            setShowPopup(false);
            window.location.reload();
        }
        catch (error) {
            console.log('Error updating ticket:', error.response);
        }
    };

    const handleCancelClick = () => {
        setSelectedTicket(null);
        setSolution('');
        setShowPopup(false);
    };


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
    /* Adjusting text color for dark mode */
    .navbar-light .navbar-nav .nav-link {
        color: white !important;
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
                    return;
                }

                const uid = localStorage.getItem("userId");
                const response = await axios.get(`${backend_url}/users/${uid}`, {
                    withCredentials: true,
                });
                setUserName(response.data.displayName);
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        }
        async function fetchTickets() {
            try {
                const response = await axios.get(`${backend_url}/tickets`, {
                    withCredentials: true,
                });
                setTickets(response.data.tickets);
            } catch (error) {
                console.log("Error fetching tickets:", error);
            }
        }
        fetchTickets();
        fetchUserData();
    }, [cookies.token], showNotification);
    const Button = ({ text }) => {
        const [isHovered, setIsHovered] = useState(false);

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        const buttonStyle = {
            fontSize: '16px',
            padding: '10px 20px',
            backgroundColor: isHovered ? '#8a4cf6' : '#6a0080', // Purple colors
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        };
        return (
            <button
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {text}
            </button>
        );
    };

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
            {/* <h1 style={{ textAlign: "left", margin: "40px", color: 'black', fontFamily: "Times New Roman", fontWeight: "bold" }}>
                {`Hello ${userName}`}
            </h1> */}

            <h2 style={{ textAlign: "center", margin: "20px 0", color: 'purple' }}>Open Tickets</h2>
            <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                <table className="table">
                    <thead style={{ backgroundColor: '#6A5ACD', color: 'white' }}>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Subcategory</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.filter((ticket) => ticket.status === 'pending').map((ticket, index) => (
                            <tr key={ticket._id}>
                                <td>{index + 1}</td>
                                <td>{ticket.category}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.subCategory}</td>
                                <td>
                                    {/* Pass the specific ticket to handleUpdateClick */}
                                    <button
                                        style={{ backgroundColor: '#6A5ACD', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                                        onClick={() => handleUpdateClick(ticket)} // Pass the ticket data here
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {showPopup && (
                    <div className="popup">
                        <div className="popup-content" style={{ backgroundColor: 'white', border: '2px solid purple', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '10px', zIndex: '999' }}>
                            <label htmlFor="solutionInput" style={{ color: 'purple', fontSize: '20px' }}>Solution:</label>
                            <input
                                type="text"
                                id="solutionInput"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                style={{ width: '100%', padding: '5px', marginBottom: '10px', borderRadius: '5px' }}
                            />
                            <button onClick={handleSaveClick} style={{ backgroundColor: '#8A2BE2', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', marginRight: '10px' }}>Save</button>
                            <button onClick={handleCancelClick} style={{ backgroundColor: '#DC143C', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </>

    )
}