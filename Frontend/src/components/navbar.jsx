import { Link, Route, Routes } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function AppNavBar() {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Nav>
          <Nav.Item>
            <Link to="/home" style={{ marginLeft: '-130px', fontWeight: 'bold', color: 'rgb(166, 0, 255)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>Home</Link>
          </Nav.Item>
          <Nav.Item>
            <FaUser onClick={handleUserIconClick} style={{ marginLeft: '10px', fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)' }} />
          </Nav.Item>
        </Nav>
      </Container>
      {isUserTabOpen && (
        <div style={{ position: 'absolute', top: '50px', right: '10px', width: '300px', height: '500px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px' }}>
          {/* User tab content */
            <Nav.Item>
              <Link to="/" style={{ position: 'absolute', textAlign: 'right', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none', }}>Logout</Link>
            </Nav.Item>
          }
        </div>
      )}
    </Navbar>
  );
}
