import React, { useEffect, useState } from "react";
// import AppNavBar from "../components/navbar";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function Reports() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false)
  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
         // navigate("/");
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get($,{backend_url}/users/$,{uid}, {
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


        const response = await axios.get($,{backend_url}/tickets, {
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

    
      <table className="table"style={{ marginTop: '80px' , width: '90%',margin: 'auto'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Subcategory</th>
            {/* Add more columns if needed */}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket._id}</td>
              <td>{ticket.category}</td>
              <td>{ticket.status}</td>
              <td>{ticket.subCategory}</td>
              {/* Render other ticket data in respective columns */}
            </tr>
          ))}
        </tbody>
      </table>

    </>
  );
}