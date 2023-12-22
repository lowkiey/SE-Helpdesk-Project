import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { useCookies } from "react-cookie";


let backend_url = "http://localhost:3000/api/v1";

export default function Tickets() {
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
    const [showNotification, setShowNotification] = useState(false); // New state for notification
    const [notifications, setNotifications] = useState([]);

    async function fetchNotifications() {
        try {
            const userEmail = localStorage.getItem("email");
            const response = await axios.get(`${backend_url}/notification/?email=${userEmail}`, { withCredentials: true, });
            setNotifications(response.data.notificationsCombined);
            console.log("response", response.data);
            return response.data; // Assuming the response contains an array of notifications
        } catch (error) {
            console.log("Error fetching notifications:", error.response); // Log the error response
            return []; // Return an empty array if there's an error
        }
    }
    const handleUserIconClick = () => {
        setIsUserTabOpen(!isUserTabOpen);
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                if (!cookies.token) {
                    console.log("No token found, redirecting to login");
                    return; // Exit early if there's no token
                }

                const uid = localStorage.getItem("userId");
                const response = await axios.get(`${backend_url}/users/${uid}`, {
                    withCredentials: true,
                });
                setUserName(response.data.displayName); // Assuming the display name comes from the response
            } catch (error) {
                console.log("Error fetching user data:", error);
                // Redirect to login page on error: navigate("/")
            }
        }
        async function fetchIssueData() {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/updateTicket/issues");
                setIssueData(response.data); // Update state with fetched issue data
            } catch (error) {
                console.error('Error fetching issue data:', error);
                // Handle errors, such as displaying an error message
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
        fetchNotifications()
        fetchUserData();
    }, [cookies.token]);


    const handleCreateTicketClick = () => {
        setTicketModalVisible(true);
    };

    const handleCloseModal = () => {
        setTicketModalVisible(false);
        setShowWorkflowSteps(false);
    };
    const handleSaveTicket = () => {
        setShowWorkflowSteps(true);
    };

    const handleDescriptionChange = (e) => {
        const description = e.target.value;
        setDescription(description);
    };
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedCategory(selectedCategory);

        switch (selectedCategory) {
            case '1': // Hardware
                setSubCategoryOptions(['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment']);
                break;
            case '2': // Software
                setSubCategoryOptions(['Operating system', 'Application software', 'Custom software', 'Integration issues']);
                break;
            case '3': // Network
                setSubCategoryOptions(['Email issues', 'Internet connection problems', 'Website errors']);
                break;
            default:
                setSubCategoryOptions([]);
                break;
        }
    };

    const handleSubCategoryChange = (e) => {
        const selectedSubCategory = e.target.value;
        setSelectedSubCategory(selectedSubCategory);

        // Assign workflow steps based on category and subcategory
        if (selectedCategory === '2') { // Software
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
                case ' Application software':
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
                case "Integration issues":
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

                case "Custom software":
                    setDescription(`
          1-Check Documentation:
          Refer to the user manual or documentation for the custom software.
          Look for troubleshooting sections.
          
          2-Contact Support:
          Find the support contact information for the custom software.
          Reach out to the software vendor or developer for assistance.`
                    );
            }
        } else if (selectedCategory === '1') { // Hardware
            switch (selectedSubCategory) {
                case "Desktops":
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
                case "Laptops":
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
        else if (selectedCategory === '3') { // Network
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
                case "Internet Connection Issues":
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
    };

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
                            <Nav.Link as={Link} to="/reports" style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginLeft: '50px' }}>
                                Reports
                            </Nav.Link>
                        </Nav>
                        <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
                            {/* User Icon */}

                            {/* //listgroup use  */}

                            {/* Notification Icon */}
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
                                                    {notifications.map(notification => (
                                                        <li key={notification._id}>
                                                            <p>From: {notification.from}</p>
                                                            <p>{notification.text}</p>
                                                            <hr style={{ margin: '5px 0' }} />
                                                        </li>
                                                    ))}
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
                                        style={{ fontSize: '24px', cursor: 'pointer', color: 'purple', marginRight: '-40px' }}
                                    />
                                    {isUserTabOpen && (
                                        <div style={{ position: 'absolute', top: '30px', right: '-190px', width: '200px', height: '100px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px' }}>
                                            {/* User tab content */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>

                                                <div>
                                                    <p style={{ margin: '10px', fontSize: '20px', fontWeight: 'bold', marginTop: '-0.5vh ' }}>{`${userName}`}</p>
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
            {/* <h1 style={{ textAlign: "left", margin: "40px", color: 'black', fontFamily: "Times New Roman", fontWeight: "bold" }}>
                {`Hello ${userName}`}
            </h1> */}
            <Container>
                <h2 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "sans-serif", fontWeight: "bold" }}> My Previous Tickets</h2>
                <table className="table table-striped">
                    <thead>
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
                <div className="text-center">
                    <button className="btn btn-primary mt-3" onClick={handleCreateTicketClick}>Create New Ticket</button>
                </div>
            </Container>

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
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">
                    Category
                </label>
                <select className="form-select" id="inputGroupSelect01" onChange={handleCategoryChange}>
                    <option value="">Choose...</option>
                    <option value="1">Hardware</option>
                    <option value="2">Software</option>
                    <option value="3">Network</option>
                </select>
            </div>
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
            <button onClick={handleSaveTicket}>Save</button>
            <button onClick={handleCloseModal}>Cancel</button>

            <div className="workflow-steps">
                {selectedCategory && selectedSubCategory && showWorkflowSteps && (
                    <div className="workflow-steps">
                        <h3>Workflow Steps:</h3>
                        <pre>{description}</pre>
                    </div>
                )};
            </div>
        </>
    )
};