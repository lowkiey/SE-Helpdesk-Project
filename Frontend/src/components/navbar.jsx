<<<<<<< HEAD
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';

export default function AppNavBar() {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };

  return (<Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto ms-lg-5" style={{ margin: "0px", marginLeft: '100px' }}>
          <Nav.Link as={Link} to="/home" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }}>
            Home
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
  );
}
=======
import { Link, Route, Routes } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function AppNavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Nav>
          <Nav.Item>
            <Link to="/home" style={{ marginLeft: '-130px', fontWeight: 'bold', color: 'rgb(166, 0, 255)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>Home</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/" style={{ marginLeft: '1350px', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>Logout</Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}
>>>>>>> origin/george_new
