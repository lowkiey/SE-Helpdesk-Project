import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

let backend_url = "http://localhost:3000/api/v1";

export default function Reports() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
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
  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setReportForm({ ...reportForm, [name]: value });
  };
  const handleReportSubmit = async () => {
    try {
      const response = await axios.post(`${backend_url}/reports/${tickets._id}`, reportForm, {
        withCredentials: true,
      });

      console.log("Report created:", response.data);

      // Close the modal after submitting the report
      setShowModal(false);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
          //navigate("/");
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });

        console.log("response", response);
        setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
       // navigate("/"); // Redirect to login page on error
      }
    }

    async function fetchTickets() {
      try {
        const response = await axios.get(`${backend_url}/tickets/getAllTickets`, {
          withCredentials: true,
        });

        console.log("response", response);
        setTickets(response.data.tickets);
      } catch (error) {
        console.log("Error fetching user data:", error);
       // navigate("/"); // Redirect to login page on error
      }
    }

    fetchTickets();
    fetchUserData();
  }, [cookies.token, navigate]);

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
      backgroundColor: isHovered ? '#8a2be2' : '#800080', // Purple colors
      color: 'white',
      border: '2px solid #8a2be2', // Purple border
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, color 0.3s',
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
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
              <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}>
                HelpDesk
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Item>
                <FaUser
                  onClick={handleUserIconClick}
                  style={{ position: 'inherit', top: '15px', right: '60px', fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}
                />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {isUserTabOpen && (
          <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 100, backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}>
            {/* User tab content */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}>
                {/* Placeholder image */}
                <img src="https://via.placeholder.com/50" alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>User Name</p>
                <Link to="/" style={{ color: 'rgb(209, 151, 240)', textDecoration: 'none' }}>Logout</Link>
              </div>
            </div>
          </div>
        )}
      </Navbar>
      
      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginInlineEnd: '140px' }}>
        <Button text="View Issues" />
        <div style={{ marginLeft: '20px' }} />
        <Button text="View All Reports" />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Form fields for creating reports */}
            <Form.Group controlId="agent_id">
              <Form.Label>Agent ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Agent ID"
                name="agent_id"
                value={reportForm.agent_id}
                onChange={handleFormFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="ticketStatusReport">
              <Form.Label>Ticket Status Report</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Ticket Status Report"
                name="ticketStatusReport"
                value={reportForm.ticketStatusReport}
                onChange={handleFormFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="resoultionTimeReport">
              <Form.Label>Resolution Time Report</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Resolution Time Report"
                name="resoultionTimeReport"
                value={reportForm.resoultionTimeReport}
                onChange={handleFormFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="agentPreformanceReport">
              <Form.Label>Agent Performance Report</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Agent Performance Report"
                name="agentPreformanceReport"
                value={reportForm.agentPreformanceReport}
                onChange={handleFormFieldChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReportSubmit}>
            Submit Report
          </Button>
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
              <td>{index + 1}</td> {/* Display index + 1 to start from 1 instead of 0 */}
              <td>{ticket._id}</td>
              <td>{ticket.category}</td>
              <td>{ticket.status}</td>
              <td>{ticket.subCategory}</td>
              <td>
              <button onClick={() => setShowModal(true)}>Create Report</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}