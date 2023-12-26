import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled, { createGlobalStyle } from 'styled-components';

const backend_url = "http://localhost:3000/api/v1";




export default function assign() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);
    const [userName, setUserName] = useState("");
    const [isUserTabOpen, setIsUserTabOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [role, setRole] = useState("");
    const [rating, setRating] = useState('');
    const [resolutionTime, setResolutionTime] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [numberOfTickets, setNumberOfTickets] = useState(5);
    const [showAgentFields, setShowAgentFields] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [theme, setTheme] = useState("light");
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [email, setEmail] = useState(''); // Added email state
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [fileContent, setFileContent] = useState('');

    const handleUserIconClick = () => {
        setIsUserTabOpen(!isUserTabOpen);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        let data = {
            email,
            password,
            displayName,
            role
        };
        if (role === 'agent') {
            // rating, resolution_time, ticket_id
            data = {
                ...data,
                rating: Number(rating), // Ensure rating is a number
                resolution_time: resolutionTime,
                // Make sure this is the correct format for your backend
                // Ensure numberOfTickets is a number
            };
        }
        try {
            const response = await axios.post(`${backend_url}/users/create`, data, {
                withCredentials: true,
            });
            setToastMessage('User Created successfully');
            setShowToast(true);
            console.log(response.data.message);
            setShowModal(false);
        } catch (error) {
            setToastMessage('Cannot Create User');
            setShowToast(true);
            console.error("Error Creating User:", error);
        }
    };


    const openFile = async () => {
        try {
            const response = await axios.get(backend_url + '/users/read-error-log', { withCredentials: true });
            setFileContent(response.data.content);
        } catch (error) {
            console.error('Error fetching file content:', error);
            // Handle error (e.g., set error message in state and display it)
        }
    };

    // State to hold the file content


    // Your button to fetch and display the file content

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
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
    const LightMode = styled.div`
  background-color: white;
    color: black;
`;

    // Dark Mode styles
    const DarkMode = styled.div`
  background-color: #0d001a;
  color: dark;

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

    const StyledTable = styled.table`
  width: 90%;
  margin: auto;
  color: ${(props) => props.theme === 'dark' ? 'white' : 'purple'};
  font-family: "Sans-Serif";
  font-weight: bold;

  thead {
    background-color: ${(props) => props.theme === 'dark' ? '#222' : 'purple'};
  }

  tbody tr {
    background-color: ${(props) => props.theme === 'dark' ? '#333' : 'white'};
    color: ${(props) => props.theme === 'dark' ? 'white' : 'black'};
  }

  th, td {
    border-color: ${(props) => props.theme === 'dark' ? '#444' : '#ddd'};
  }
`;

    const StyledNavbar = styled(Navbar)`
  background-color: ${(props) => props.theme === 'dark' ? 'white' : '#f8f9fa'};
  transition: background-color 0.3s ease;

  .nav-link {
    color: ${(props) => props.theme === 'dark' ? 'purple' : 'purple'} !important; // Overriding Bootstrap styles might require !important
  }

  // Add any additional theming for other elements within the Navbar here
`;
    const handleToggleChange = () => {
        toggleTheme();
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


    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);


    const openCreateUserModal = () => {
        setShowCreateUserModal(true);
        setShowAgentFields(false); // Reset agent fields visibility
    };
    const closeCreateUserModal = () => setShowCreateUserModal(false);
    const openAssignRoleModal = () => setShowAssignRoleModal(true);
    const closeAssignRoleModal = () => setShowAssignRoleModal(false);



    const handleAssignRole = async (e) => {
        e.preventDefault();
        let data = {
            displayName,
            role
        };




        // Add additional data if the role is 'agent'
        if (role === 'agent') {
            // rating, resolution_time, ticket_id
            data = {
                ...data,
                rating: Number(rating), // Ensure rating is a number
                resolution_time: resolutionTime,
                // Make sure this is the correct format for your backend
                // Ensure numberOfTickets is a number
            };
        }



        try {
            const response = await axios.post(`${backend_url}/users/assign`, data, {
                withCredentials: true,
            });
            setToastMessage('Role added successfully');
            setShowToast(true);
            console.log(response.data.message);
            setShowModal(false);
        } catch (error) {
            setToastMessage('Cannot change role');
            setShowToast(true);
            console.error("Error updating user role:", error);
        }
    };


    const handleRoleChangeForCreateUser = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);
        setShowAgentFields(selectedRole === 'agent'); // Update this line for agent fields visibility
    };
    async function fetchUsers() {
        try {
            const response = await axios.get(`${backend_url}/users/`, {
                withCredentials: true,
            });
            console.log("API Response:", response.data); // Log to check the API response

            // Check if the response is an array and update the state
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error("Invalid data format received:", response.data);
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
            navigate("/");
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
        fetchUsers();
    }, [cookies.token, navigate]);

    const handleCategoryChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);
        setShowAgentFields(selectedRole === 'agent'); // Update this line
    };





    return (
        <>
            <GlobalStyle theme={theme} />
            <StyledNavbar expand="lg" variant={theme} theme={theme}>
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
                            <Nav.Link as={Link} to="/reports" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                Reports
                            </Nav.Link>
                            <Nav.Link onClick={openAssignRoleModal} style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                Assign Role
                            </Nav.Link>

                        </Nav>
                        <Nav className="ms-auto">
                        </Nav>
                        <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
                            <Nav.Item>
                                <div style={{ position: 'relative' }}>
                                    <FaBell
                                        onClick={() => setShowNotification(!showNotification)}
                                        style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '50px' }}
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
                                        style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '50px' }}
                                    />
                                    {/* User tab content */}
                                    <div style={{ position: 'absolute', top: '35px', right: '-150px', width: '200px', height: '150px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', visibility: isUserTabOpen ? 'visible' : 'hidden' }}>
                                            <p style={{ margin: '10px', fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{`${userName}`}</p>
                                            {/* Toggle switch for both modes */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div>
                                                    <label className="toggle-container">
                                                        <span className="toggle-label" style={{ color: theme === 'dark' ? 'black' : 'black' }}>
                                                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                                        </span>
                                                    </label>
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
            </StyledNavbar>
            <h1 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
                {`Hello Admin ${userName} , What are you trying to do today?`} {/* by3rfni 3aleh w y2oli ezayik ya latifa */}
            </h1>

            <div style={{ textAlign: 'center', margin: '20px' }}>
                <button
                    onClick={openCreateUserModal}
                    style={{
                        backgroundColor: 'purple',
                        color: theme === 'dark' ? '#fff' : 'white',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: 'medium'
                    }}
                >
                    Create User
                </button>
            </div>


            <h1 style={{
                display: "inline-block", // This makes the background only as wide as the text
                textAlign: "left",
                margin: "40px 0 40px 20px", // Removed horizontal margin to align with the page content
                padding: "20px", // Equal padding on all sides
                color: theme === 'dark' ? '#fff' : 'purple',
                fontFamily: "Sans-Serif",
                fontWeight: "bold",
                fontSize: "18px",
                borderLeft: "5px solid purple",
                backgroundColor: theme === 'dark' ? '#333' : 'lightgrey',
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)"
            }}>
                All users details :
            </h1>

            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Modal for assigning roles */}
            <Modal show={showAssignRoleModal} onHide={closeAssignRoleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAssignRole}>
                        <Form.Group controlId="formDisplayName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter user's name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoleSelect">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setShowAgentFields(e.target.value === 'agent');
                                    handleCategoryChange(e)
                                }}
                            >
                                <option value="">Select a role</option>
                                <option value="admin">Manager</option>
                                <option value="agent">Agent</option>
                                <option value="user">User</option>
                            </Form.Control>
                        </Form.Group>

                        {showAgentFields && (
                            <>
                                <Form.Group controlId="formRating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter agent's rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formResolutionTime">
                                    <Form.Label>Resolution Time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter resolution time"
                                        value={resolutionTime}
                                        onChange={(e) => setResolutionTime(e.target.value)}
                                    />
                                </Form.Group>
                                {/* <Form.Group controlId="formNumberOfTickets">
            <Form.Label>Number of Tickets</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of tickets"
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(e.target.value)}
            />
          </Form.Group> */}
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeAssignRoleModal}>
                        Close
                    </Button>
                    <button className="btn btn-primary" onClick={handleAssignRole} style={{ backgroundColor: '#A280A1' }}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>


            {/* Modal for creating users */}
            <Modal show={showCreateUserModal} onHide={closeCreateUserModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateUser}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter user's email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDisplayName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter user's name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoleSelect">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setShowAgentFields(e.target.value === 'agent');
                                    handleCategoryChange(e)
                                }}
                            >
                                <option value="">Select a role</option>
                                <option value="Manager">Manager</option>
                                <option value="agent">Agent</option>
                                <option value="user">User</option>
                            </Form.Control>
                        </Form.Group>
                        {showAgentFields && (
                            <>
                                <Form.Group controlId="formRating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter agent's rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formResolutionTime">
                                    <Form.Label>Resolution Time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter resolution time"
                                        value={resolutionTime}
                                        onChange={(e) => setResolutionTime(e.target.value)}
                                    />
                                </Form.Group>
                                {/* <Form.Group controlId="formNumberOfTickets">
            <Form.Label>Number of Tickets</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of tickets"
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(e.target.value)}
            />
          </Form.Group> */}
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCreateUserModal}>
                        Close
                    </Button>
                    <button className="btn btn-primary" onClick={handleCreateUser} style={{ backgroundColor: '#A280A1' }}>
                        Create
                    </button>
                </Modal.Footer>
            </Modal>

            {/* table of all users */}


            <StyledTable theme={theme}>
                <thead style={{
                    backgroundColor: theme === 'dark' ? '#222' : 'purple', // header background color changes based on theme
                    color: theme === 'dark' ? 'white' : 'white' // header text color changes based on theme
                }}>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>email</th>
                        <th>displayName</th>
                        <th>role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((users, index) => (
                        <tr key={users._id} style={{
                            backgroundColor: theme === 'dark' ? '#333' : '', // row background color changes based on theme
                            color: theme === 'dark' ? 'white' : 'black' // row text color changes based on theme
                        }}>

                            <td>{index + 1}</td>
                            <td>{users._id}</td>
                            <td>{users.email}</td>
                            <td>{users.displayName}</td>
                            <td>{users.role}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>


            <div style={{ margin: "40px 0 40px 20px" }}>
                {/* Grey box container */}
                <div style={{
                    display: "inline-block", // Adjusts the width to the content inside
                    padding: "20px",
                    color: theme === 'dark' ? '#fff' : 'purple',
                    fontFamily: "Sans-Serif",
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderLeft: "5px solid purple",
                    backgroundColor: theme === 'dark' ? '#333' : 'lightgrey',
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)"
                }}>
                    Show Errors Logs
                </div>

                {/* Button outside the grey box */}
                <div style={{ textAlign: 'left', marginTop: '20px' }}>

                    <button onClick={openFile} style={{
                        backgroundColor: 'purple',
                        color: theme === 'dark' ? '#fff' : 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: 'medium'
                    }}>
                        Show
                    </button>
                </div>
            </div>

            <div>
                <pre>{fileContent}</pre>
            </div>
        </>

    );
};