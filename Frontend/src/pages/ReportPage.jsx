import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function ReportPage() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [userName, setUserName] = useState("");
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const [reports, setReports] = useState([]);

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          //navigate("/");
          return; // Exit early if there's no token
        }
        axios.defaults.headers.common["authorization"] = Bearer `${token}`; // Set the token in headers

        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);
      } catch (error) {
        console.log("Error fetching user data:", error);
        //navigate("/"); // Redirect to the login page on error
      }
    }

    async function fetchReports() {
      try {
        const response = await axios.get(`${backend_url}/reports/`, {
          withCredentials: true,
        });
        console.log("API response:", response.data); 
        setReports(response.data);
      } catch (error) {
        console.log("Error fetching reports:", error);
      }
    }

    fetchReports();
    fetchUserData();
  }, [cookies.token, navigate]);
  
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
              <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}>
                Tickets
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

      <div className="container mt-5">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Agent ID</th>
              <th>Ticket ID</th>
              <th>Ticket Status Report</th>
              <th>Resolution Time Report</th>
              <th>Agent Performance Report</th>
              <th>Agent Rating</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.agent_id}</td> 
                <td>{report.ticket_id}</td>
                <td>{report.ticketStatusReport}</td>
                <td>{report.resoultionTimeReport}</td>
                <td>{report.agentPreformanceReport}</td>
                <td>{report.agentRating.$numberDecimal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}