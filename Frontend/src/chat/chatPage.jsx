import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link, NavLink } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi"; // Import the back icon from your desired icon library
import { useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FaUser } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import styled, { createGlobalStyle } from 'styled-components';


const ChatComponent = ({ socket }) => {
  const typingTimeout = 500; // milliseconds
  const navigate = useNavigate();
  const [toggleButtonText, setToggleButtonText] = useState("Disconnect");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  const [displayName, setDisplayName] = useState(""); // Default to "User" if display name is not available
  let typingIndicatorTimeout;
  const { userId } = useParams();
  const [theme, setTheme] = useState("light");

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
  const toggleConnection = (e) => {
    e.preventDefault();
    if (socket && socket.connected) {
      setToggleButtonText("Connect");
      socket.disconnect();
    } else if (socket) {
      setToggleButtonText("Disconnect");
      socket.connect();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && inputValue) {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    clearTimeout(typingIndicatorTimeout);
    if (socket) {
      socket.emit("typing");
      typingIndicatorTimeout = setTimeout(() => {
        socket.emit("stop typing");
      }, typingTimeout);
    }
  };

  const appendMessage = (msg) => {
    const formattedTime = getFormattedTime();
    const newMessage = (
      <li key={messages.length} className="list-group-item">
        <strong>{displayName}</strong>: {msg} ({formattedTime})
      </li>
    );
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const showTypingIndicator = (user) => {
    const indicator = (
      <li key={`typing-${user}`} className="list-group-item typing-indicator">
        <i className="bi bi-chat-dots"></i> {user} is typing...
      </li>
    );
    setMessages((prevMessages) => [...prevMessages, indicator]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const hideTypingIndicator = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => !msg.props || !msg.props.className || !msg.props.className.includes("typing-indicator"))
    );
  };

  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const storedDisplayName = localStorage.getItem("name");
        setDisplayName(storedDisplayName || "User");
        const role = localStorage.getItem("role");
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInformation();

    if (socket) {
      socket.on("chat message", (msg) => {
        appendMessage(msg);
      });

      socket.on("typing", (user) => {
        showTypingIndicator(user);
      });

      socket.on("stop typing", () => {
        hideTypingIndicator();
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, setDisplayName]);
  const handleBack = () => {
    if (userRole === "agent") {
      navigate("/chat");
    } else if (userRole === "user") {
      navigate("/home");
    };
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
                      <p style={{ margin: '10px', fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{`${displayName}`}</p>
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
      <div className="container-fluid" style={{ maxWidth: "50%" }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card mt-4">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'purple' }}>
                <Link to="/chat" className="btn btn-secondary d-flex align-items-center" onClick={handleBack} style={{ backgroundColor: 'white', color: 'purple', borderColor: 'purple' }}>
                  <FiChevronLeft /> Back
                </Link>
                <h4 style={{ margin: "0", color: 'white' }}>Chats</h4>
              </div>
              <ul id="messages" className="list-group">
                {messages.map((msg, index) => (
                  <li key={index} className="list-group-item">
                    {msg}
                  </li>
                ))}
              </ul>
              <div className="card-footer">
                <form id="form" className="form-inline" onSubmit={handleSubmit}>
                  <input
                    id="input"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{ width: "100%", height: "40px", marginRight: "5px" }}
                  />
                  <button style={{ backgroundColor: 'purple', borderColor: 'purple', height: "40px", marginTop: '20px' }} className="btn btn-primary" type="submit">
                    Send
                  </button>
                  <button id="toggle-btn" className="btn btn-danger ml-2" onClick={toggleConnection} style={{ height: "40px", marginLeft: "710px", marginTop: '20px' }}>
                    {toggleButtonText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChatComponent.propTypes = {
  socket: PropTypes.shape({
    connected: PropTypes.bool,
    emit: PropTypes.func,
    on: PropTypes.func,
    disconnect: PropTypes.func,
    connect: PropTypes.func, // Add this line to include the 'connect' method
  }),
};


export default ChatComponent;