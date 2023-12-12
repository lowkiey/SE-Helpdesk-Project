import React, { useEffect, useState } from "react";
<<<<<<< HEAD
// import AppNavBar from "../components/navbar";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

=======
import AppNavBar from "../components/navbar";
import axios from "axios";
>>>>>>> origin/george_new
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [userName, setUserName] = useState("");
<<<<<<< HEAD
  const [isUserTabOpen, setIsUserTabOpen] = useState(false)
  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };
=======

>>>>>>> origin/george_new
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!cookies.token) {
          console.log("No token found, redirecting to login");
<<<<<<< HEAD
          navigate("/");
=======
          navigate("/login");
>>>>>>> origin/george_new
          return; // Exit early if there's no token
        }

        const uid = localStorage.getItem("userId");
<<<<<<< HEAD
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);

        setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/"); // Redirect to login page on error
=======
        // const response = await axios.get(${backend_url}/users/${uid}, {
        //   withCredentials: true,
        // });

        // Assuming the user's display name is fetched from response.data.displayName
        // setUserName(response.data.displayName);
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/login"); // Redirect to login page on error
>>>>>>> origin/george_new
      }
    }

    fetchUserData();
  }, [cookies.token, navigate]);

  return (
    <>
<<<<<<< HEAD
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
      <h1 style={{ textAlign: "left", margin: "40px", color: 'black', fontFamily: "Times New Roman", fontWeight: "bold" }}>
        {`Hello ${userName}`} {/* Displaying the username */}
=======
      <AppNavBar />
      <h1 style={{ textAlign: "center", margin: "30px", color: 'white' }}>
        Hello {userName}
>>>>>>> origin/george_new
      </h1>
    </>
  );
}