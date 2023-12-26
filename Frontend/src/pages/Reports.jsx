import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaBell, FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import viewReport from "./viewReport";
import issuePage from "./issuePage";
import styled, { createGlobalStyle } from 'styled-components';
let backend_url = "http://localhost:3000/api/v1";

export default function Reports() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  const [agent_id, setAgentid] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ticketStatusReport, setTicketStatusReport] = useState("");
  const [resoultionTimeReport, setResolutionTimeReport] = useState("");
  const [agentPreformanceReport, setagentPerformanceReport] = useState("");
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
  const LightMode = styled.div
    `background-color: white;
    color: black;`
    ;

  // Dark Mode styles
  const DarkMode = styled.div
    `background-color: #0d001a;
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

  const [tickets, setTickets] = useState([]);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
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

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
  const [showModal, setShowModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    agent_id: "",
    ticketStatusReport: "",
    resoultionTimeReport: "",
    agentPreformanceReport: "",
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    let data = {
      agent_id,
      ticketStatusReport,
      resoultionTimeReport,
      agentPreformanceReport,
    }
    try {
      // console.log(${ backend_url } / reports / ${ selectedTicketId });
      const response = await axios.post(
        `${backend_url}/reports/${selectedTicketId}`,
        data,
        { withCredentials: true }
      );
      if (!selectedTicketId) {
        console.error("No ticket selected");
        return;
      }



      console.log("Report created:", response.data);

      setShowModal(false);
    } catch (error) {
      console.error("Error creating report");
    }
  };
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
    async function fetchTickets() {
      try {
        const response = await axios.get(`${backend_url}/tickets`, {
          withCredentials: true,
        });

        console.log("response", response);
        setTickets(response.data.tickets);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/"); // Redirect to login page on error
      }
    }
    fetchUserData();
    fetchNotifications()
    fetchTickets();
  }, [cookies.token, navigate]);
  const Button = ({ text, onClick }) => {
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
      backgroundColor: isHovered ? '#8a2be2' : '#800080',
      color: 'white',
      border: '2px solid #8a2be2',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, color 0.3s',
    };

    return (
      <button
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };
  return (
    <>
      <GlobalStyle theme={theme} />
      <div className={theme === 'dark' ? 'dark-mode' : ''}>
        {theme === 'light' ? (
          <LightMode>
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


            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginInlineEnd: '140px' }}>
              <Button text="View Issues" onClick={() => navigate('/issue')} />
              <div style={{ marginLeft: '20px' }} />
              <Button text="View All Reports" onClick={() => navigate('/viewReport')} />
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create Report</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleReportSubmit}>
                  {/* Form fields for creating reports */}
                  <Form.Group controlId="agent_id">
                    <Form.Label>Agent ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Agent ID"
                      name="agent_id"
                      value={agent_id}
                      onChange={(e) => setAgentid(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="ticketStatusReport">
                    <Form.Label>Ticket Status Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Ticket Status Report"
                      name="ticketStatusReport"
                      value={ticketStatusReport}
                      onChange={(e) => setTicketStatusReport(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="resoultionTimeReport">
                    <Form.Label>Resolution Time Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Resolution Time Report"
                      name="resoultionTimeReport"
                      value={resoultionTimeReport}
                      onChange={(e) => setResolutionTimeReport(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="agentPreformanceReport">
                    <Form.Label>Agent Performance Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Agent Performance Report"
                      name="agentPreformanceReport"
                      value={agentPreformanceReport}
                      onChange={(e) => setagentPerformanceReport(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleReportSubmit}>
                  Submit
                </button>
              </Modal.Footer>
            </Modal>


            <table className="table" style={{ marginTop: '80px', width: '90%', margin: 'auto' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Subcategory</th>
                  <th>Action</th> {/* New column for the "Create Report" button */}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket._id}>

                    <td>{index + 1}</td>
                    <td>{ticket._id}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.subCategory}</td>
                    <td>
                      <button onClick={() => {
                        setSelectedTicketId(ticket._id);
                        setShowModal(true);
                      }}>
                        Create Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </LightMode>
        ) : (
          <DarkMode>
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


            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginInlineEnd: '140px' }}>
              <Button text="View Issues" onClick={() => navigate('/issue')} />
              <div style={{ marginLeft: '20px' }} />
              <Button text="View All Reports" onClick={() => navigate('/viewReport')} />
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create Report</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleReportSubmit}>
                  {/* Form fields for creating reports */}
                  <Form.Group controlId="agent_id">
                    <Form.Label>Agent ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Agent ID"
                      name="agent_id"
                      value={agent_id}
                      onChange={(e) => setAgentid(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="ticketStatusReport">
                    <Form.Label>Ticket Status Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Ticket Status Report"
                      name="ticketStatusReport"
                      value={ticketStatusReport}
                      onChange={(e) => setTicketStatusReport(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="resoultionTimeReport">
                    <Form.Label>Resolution Time Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Resolution Time Report"
                      name="resoultionTimeReport"
                      value={resoultionTimeReport}
                      onChange={(e) => setResolutionTimeReport(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="agentPreformanceReport">
                    <Form.Label>Agent Performance Report</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Agent Performance Report"
                      name="agentPreformanceReport"
                      value={agentPreformanceReport}
                      onChange={(e) => setagentPerformanceReport(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleReportSubmit}>
                  Submit
                </button>
              </Modal.Footer>
            </Modal>


            <table className="table" style={{ marginTop: '80px', width: '90%', margin: 'auto', color: 'purple', fontFamily: "Sans-Serif", fontWeight: "bold" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Subcategory</th>
                  <th>Action</th> {/* New column for the "Create Report" button */}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket._id}>

                    <td>{index + 1}</td>
                    <td>{ticket._id}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.subCategory}</td>
                    <td>
                      <button onClick={() => {
                        setSelectedTicketId(ticket._id);
                        setShowModal(true);
                      }}>
                        Create Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


          </DarkMode>

        )}
      </div>

    </>
  );
}