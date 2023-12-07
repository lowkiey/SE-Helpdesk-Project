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
            <Link to="/" style={{ marginLeft: '-130px', fontWeight: 'bold', color: 'rgb(166, 0, 255)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>Home</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/login" style={{ marginLeft: '1350px', fontWeight: 'bold', color: 'rgb(209, 151, 240)', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>Logout</Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}
