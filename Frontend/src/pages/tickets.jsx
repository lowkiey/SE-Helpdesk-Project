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

export default function Ticket() {
    const navigate = useNavigate();
    const [cookies] = useCookies([]);
    const [tickets, setTickets] = useState([]);
    const [ticketModalVisible, setTicketModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [userName, setUserName] = useState("");
    const [isUserTabOpen, setIsUserTabOpen] = useState(false);
    const [issueData, setIssueData] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [showWorkflowSteps, setShowWorkflowSteps] = useState(false);
    const [showChatAlert, setShowChatAlert] = useState(false);
    const [theme, setTheme] = useState("light");
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    //
    const [isCreateButtonVisible, setIsCreateButtonVisible] = useState(false);


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
    
      .workflow-description {
        font-size: 20px; 
        font-family: 'Arial', sans-serif; 
        background-color: #d0cdd2;
        padding: 20px; 
        border-radius: 5px; 
        border: 1px solid #000000; 
        white-space: pre-wrap; 
        overflow-wrap: break-word;
      }
    
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

    .workflow-description {
        font-size: 20px; 
        font-family: 'Arial', sans-serif; 
        background-color: rgb(89, 0, 89);
        border: purple;
        padding: 20px; 
        border-radius: 5px; 
        border: 1px solid #000000; 
        white-space: pre-wrap; 
        overflow-wrap: break-word;
        width: 50%;
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
        async function fetchIssueData() {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/updateTicket/issues");
                setIssueData(response.data);
            } catch (error) {
                console.error('Error fetching issue data:', error);
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

    const handleCreateTicketClick = () => {
        setTicketModalVisible(true);
    };
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedCategory(selectedCategory);

        switch (selectedCategory) {
            case 'Hardware': // Hardware
                setSubCategoryOptions(['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment']);
                setShowWorkflowSteps(true);
                break;
            case 'Software': // Software
                setSubCategoryOptions(['Operating system', 'Application software', 'Custom software', 'Integration issues']);
                setShowWorkflowSteps(true);
                break;
            case 'Network': // Network
                setSubCategoryOptions(['Email issues', 'Internet connection problems', 'Website errors']);
                setShowWorkflowSteps(true);
                break;
            case '4': // others
                setSubCategoryOptions([]);
                setShowWorkflowSteps(true);
                handleStartChat();
                break;
            default:
                setSubCategoryOptions([]);
                setShowWorkflowSteps(true);
                break;
        }
        console.log('Is Create Button Visible:', selectedCategory !== '' && selectedSubCategory !== '');

        setIsCreateButtonVisible(selectedCategory !== '' && selectedSubCategory !== '');

    };
    const handleCreateTicket = async () => {
        try {
            // Make a POST request to create a new ticket
            const response = await axios.post(
                `${backend_url}/tickets/`,
                {
                    user_id: localStorage.getItem("userId"),
                    category: selectedCategory,
                    subCategory: selectedSubCategory,
                    description: description,
                    status: 'open'
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Ticket created successfully:", response.data.message);
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };
    const handleStartChat = () => {
        alert('Please chat with us');
        setShowChatAlert(true);
    };
    const handleStartUserChat = async () => {

        try {
            // Make a POST request to save the user for chat
            await axios.post(`${backend_url}/messages/userChat`, {
                userId: localStorage.getItem("userId")
            },
                {
                    withCredentials: true,
                });

            navigate(`/chats/${localStorage.getItem("userId")}`);
        } catch (error) {
            console.error('Error starting chat:', error);
            // Handle error accordingly
        }
    };

    const handleSubCategoryChange = (e) => {
        const selectedSubCategory = e.target.value;
        setSelectedSubCategory(selectedSubCategory);

        // Assign workflow steps based on category and subcategory
        if (selectedCategory === 'Software') { // Software
            switch (selectedSubCategory) {
                case 'Operating system':
                    setDescription(`
            1. Check for Updates:
              - Navigate to "Settings" or "Control Panel."
              - Look for "Updates" or "System Updates."
              - Install any available updates for your operating system.

            2. Restart Your Computer:
              - Save any open work.
              - Restart your computer to apply changes.
              - Check if the issue persists after the restart.

            3. Run System Diagnostics:
              - Open "Command Prompt" as an administrator.
              - Run "sfc /scannow" to check for and repair corrupted system files.
          `);
                    break;
                case 'Application software':
                    setDescription(`
            1-Update the Application:
              Open the application.
              Look for an "Update" or "Check for Updates" option.
              Install the latest version of the application.
              
            2-Clear Cache and Data:
              Access the application settings.
              Navigate to "Storage" or "App Info."
              Clear cache and data related to the application.
              
            3-Reinstall the Application:
              Uninstall the application.
              Download and reinstall the application from the official source.
          `);
                    break;
                case 'Integration issues':
                    setDescription(`
              1-Verify Input Data:
              Ensure that data entered into integrated systems is accurate.
              Check for any missing or incorrect information.
              
              2-Monitor Integration Status:
              If there's a dashboard or status page for integrations, check it.
              Look for error messages or status indicators.
              
              3-Contact IT or Helpdesk:
              If the integration issue persists, contact your IT department or helpdesk.
              Provide details about the systems involved and any error messages.`
                    );
                    break;

                case 'Custom software':
                    setDescription(`
          1-Check Documentation:
          Refer to the user manual or documentation for the custom software.
          Look for troubleshooting sections.
          
          2-Contact Support:
          Find the support contact information for the custom software.
          Reach out to the software vendor or developer for assistance.`
                    );
            }
        } else if (selectedCategory === 'Hardware') { // Hardware
            switch (selectedSubCategory) {
                case 'Desktops':
                    setDescription(`
         1. Check Power and Connections:
         - Ensure that all cables and power cords connected to the desktop are secure.
         - Verify that the power source is functional.
      
      2. Restart the Desktop:
         - Restart your desktop.
         - Shut down the desktop, wait for a few seconds, and then power it back on.
         - Check if the issue persists after the restart.
      
      3. Update Desktop Drivers:
         - Open "Device Manager" on your computer.
         - Locate the desktop-related devices.
         - Right-click on each device and select "Update driver."
         - Follow the on-screen instructions to update drivers.
      `);
                    break
                case 'Laptops':
                    setDescription(`1. Check Power and Connections:
        - Ensure that the laptop is properly connected to the power source.
        - Verify that the power adapter is functioning correctly.
            
            2. Restart the Laptop:
                - Restart your laptop.
                - Shut down the laptop, wait for a few seconds, and then power it back on.
                - Check if the issue persists after the restart.
            
            3. Update Laptop Drivers:
                - Open "Device Manager" on your computer.
                - Locate the laptop-related devices.
                - Right-click on each device and select "Update driver."
                - Follow the on-screen instructions to update drivers.
            `);
                    break

                case "Printers":
                    setDescription(`1. Check Power and Connections:
            - Ensure that the printer is plugged into a power source.
            - Verify that all cables connecting the printer are secure.
        
        2. Restart the Printer:
            - Turn off the printer.
            - Wait for a few seconds and then turn the printer back on.
            - Check if the issue persists after the restart.
        
        3. Update Printer Drivers:
            - Open "Device Manager" on your computer.
            - Locate the printer-related devices.
            - Right-click on each device and select "Update driver."
            - Follow the on-screen instructions to update drivers.
        `);
                    break
                case "Servers":
                    setDescription(`1. Check Server Hardware:
            - Ensure that all server components are properly seated.
            - Verify that there are no loose connections inside the server.
        
        2. Restart the Server:
            - Restart the server.
            - Shut down the server, wait for a few seconds, and then power it back on.
            - Check if the issue persists after the restart.
        
        3. Monitor Server Logs:
            - Examine server logs for any error messages or warnings.
            - Address any issues indicated in the logs.
        
        4. Update Server Firmware:
            - Check for firmware updates for your server model.
            - Follow the manufacturer's instructions to update server firmware.
        `);
                    break
                case "Networking equipment":
                    setDescription(`1. Check Network Connections:
            - Ensure that all network cables are securely connected.
            - Verify that networking equipment (routers, switches) is powered on.
        
        2. Restart Networking Equipment:
            - Restart routers and switches.
            - Wait for a few seconds and then power them back on.
            - Check if the issue persists after the restart.
        
        3. Check Network Configuration:
            - Verify that the network configuration settings are correct.
            - Address any misconfigurations.
        
        4. Update Networking Device Firmware:
            - Check for firmware updates for your networking devices.
            - Follow the manufacturer's instructions to update firmware.
        `);
                    break

            }
        }
        else if (selectedCategory === 'Network') { // Network
            switch (selectedSubCategory) {
                case "Email issues":
                    setDescription(`
        1- Check Email Account Settings:
        Verify that email account settings are configured correctly.
        Confirm the correctness of the username, password, and incoming/outgoing server settings.
        
        2-Clear Email Cache:
        Clear the cache in your email client to resolve potential data conflicts.
        Remove unnecessary emails and attachments to free up storage space.
        3- Test Email on Another Device: 
        Log in to your email account on a different device to check if the issue is device-specific.
        If emails work on another device, the problem may be with the original device or its settings.`
                    );
                    break
                case "Internet connection problems":
                    setDescription(`
        1-Restart Network Devices:
        Restart your router and modem to refresh the network connection.
        Wait for a few seconds before powering them back on.
        
        2-Run Network Troubleshooter:
        Use the built-in network troubleshooter on your operating system to identify and fix common connectivity issues.
        Follow the troubleshooter's recommendations for problem resolution.
        
        3-Check for Interference: 
        Identify potential sources of interference, such as other electronic devices or competing Wi-Fi networks.
        Adjust the Wi-Fi channel on your router to minimize interference.`
                    );
                    break
                case "Website Error":
                    setDescription(`
        1-Clear Browser Cache and Cookies:
        Clear your browser's cache and cookies to resolve issues related to outdated or corrupted data.
        Reload the website after clearing the cache.
        
        2- Use Incognito/Private Browsing Mode:
        Open the website in incognito or private browsing mode to rule out issues caused by browser extensions or cached data.
        If the site works in incognito mode, try disabling browser extensions.
        
        3-Check Website URL and Protocol:
        Ensure the website URL is correct and properly formatted (e.g., "https://" if necessary).
        Verify that the website is using a secure connection (SSL/TLS) by checking for "https://" in the URL.`
                    );
                    break
            }

        };
        setIsCreateButtonVisible(selectedCategory !== '' && selectedSubCategory !== '');
    };
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
                            <Nav.Link as={Link} to="/tickets" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                Tickets
                            </Nav.Link>
                            <Nav.Link as={Link} to="/faq" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                FAQs
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

            <h2 style={{ textAlign: "center", margin: "20px 0" }}>Previous Tickets</h2>
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Subcategory</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.filter(ticket => ticket.status === 'closed').map((ticket) => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>{ticket.category}</td>
                            <td>{ticket.status}</td>
                            <td>{ticket.subCategory}</td>
                        </tr>
                    )
                    )}
                </tbody>
            </table>
            <div className="d-grid gap-2 col-2 mx-auto">
                <button onClick={handleCreateTicketClick} className="btn btn-primary" style={{ backgroundColor: 'purple', outlineColor: 'purple', borderColor: 'purple' }}>Create New Ticket</button>
            </div>
            <div>
                {ticketModalVisible && (
                    <div className="ticket-modal">
                        <div className="input-group mb-3">
                            <span className="input-group-text">@</span>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInputGroup1"
                                    placeholder="Username"
                                />
                                <label htmlFor="floatingInputGroup1">Username</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {ticketModalVisible && (
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">
                        Category
                    </label>
                    <select className="form-select" id="inputGroupSelect01" onChange={handleCategoryChange}>
                        <option value="">Choose..</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                        <option value="4">others...</option>
                    </select>
                </div>
            )}
            {selectedCategory && (
                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect02">
                        Sub-Category
                    </label>
                    <select className="form-select" id="inputGroupSelect02" onChange={handleSubCategoryChange}>
                        <option value="">Choose...</option>
                        {subCategoryOptions.map((subOption, index) => (
                            <option key={index} value={subOption}>
                                {subOption}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="form-floating">
                <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    style={{ height: '100px' }}
                ></textarea>
                <label htmlFor="floatingTextarea2">Comments</label>
            </div>


            <button className="btn btn-primary start-chat-btn" style={{ backgroundColor: '#8a4cf6', outlineColor: 'purple', borderColor: '#8a4cf6', width: '200px' }} onClick={() => handleStartUserChat()}>
                Start Chat
            </button>
            {selectedCategory && selectedSubCategory && isCreateButtonVisible && (
                <button onClick={handleCreateTicket} className="btn btn-primary" style={{ backgroundColor: 'white', outlineColor: 'purple', borderColor: 'purple', color: 'purple', marginLeft: '1476px', width: '200px' }}>Create</button>
            )}
            <div className="workflow-steps">
                {selectedCategory && selectedSubCategory && showWorkflowSteps && (

                    <div className="workflow-steps">
                        <h3 style={{ fontWeight: 'bold', fontSize: '36px' }}>Workflow Steps:</h3>
                        <pre className="workflow-description">{description}</pre>
                    </div>
                )}
            </div>
        </>

    )
}