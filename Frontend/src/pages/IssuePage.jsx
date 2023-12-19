import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

let backend_url = "http://localhost:3000/api/v1";

export default function IssuePage() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [userName, setUserName] = useState("");
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [chartData, setChartData] = useState(null);

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/");
          return; // Exit early if there's no token
        }
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`; // Set the token in headers

        const uid = localStorage.getItem("userId");
        console.log(uid);

        const response = await axios.get(`${backend_url}/users/${uid}`, {
          withCredentials: true,
        });
        console.log("response", response);
        setUserName(response.data.username); // Assuming 'username' is the field in the response containing the user's name

      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/"); // Redirect to the login page on error
      }
    }

    async function fetchIssues() {
      try {
        console.log("hi tots");
        const response = await axios.get(`${backend_url}/issues`,{
          withCredentials: true,
        });
        setChartData(response.data); // Assuming the response contains the counts data
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }

    fetchIssues();
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
      <div className="chart-container">
        {chartData ? (
          <Bar
            data={{
              labels: Object.keys(chartData), // Use category names as labels
              datasets: [
                {
                  label: 'Categories Count',
                  data: Object.values(chartData).map(category => category.total), // Use the 'total' property for data
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <p>hi</p>
        )}
      </div>
      {chartData && chartData.Hardware && (
      <div className="chart-container">
        <Bar
          data={{
            labels: Object.keys(chartData.Hardware).filter(key => key !== 'total'),
            datasets: [
              {
                label: 'Hardware Subcategories Count',
                data: Object.values(chartData.Hardware).slice(0, -1),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    )}

    {/* Software chart */}
    {chartData && chartData.Software && (
      <div className="chart-container">
        <Bar
          data={{
            labels: Object.keys(chartData.Software).filter(key => key !== 'total'),
            datasets: [
              {
                label: 'Software Subcategories Count',
                data: Object.values(chartData.Software).slice(0, -1),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    )}

    {/* Network chart */}
    {chartData && chartData.Network && (
      <div className="chart-container">
        <Bar
          data={{
            labels: Object.keys(chartData.Network).filter(key => key !== 'total'),
            datasets: [
              {
                label: 'Network Subcategories Count',
                data: Object.values(chartData.Network).slice(0, -1),
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    )}
    </>
  );
}
