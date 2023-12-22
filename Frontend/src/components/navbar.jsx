import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';

export default function AppNavBar() {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
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

  return (

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
  );
}