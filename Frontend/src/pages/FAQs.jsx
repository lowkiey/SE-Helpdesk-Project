import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';
import { FormControl, InputGroup, Nav } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { set } from "lodash";
import styled, { createGlobalStyle } from 'styled-components';

let backend_url = "http://localhost:3000/api/v1";

export default function FAQ() {
    const navigate = useNavigate();
    const [cookies] = useCookies([]);
    const [userName, setUserName] = useState("");
    const [isUserTabOpen, setIsUserTabOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [renderSubcategoryInfo, setRenderSubcategoryInfo] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [showHardwareDropdown, setShowHardwareDropdown] = useState(false);
    const [showSoftwareDropdown, setShowSoftwareDropdown] = useState(false);
    const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [faqData, setFaqData] = useState(null);
    const [faqDataS, setFaqDataS] = useState(null);
    const [theme, setTheme] = useState("light");
    const [searchText, setsearchText] = useState("");

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

    /* Adjusting text color for dark mode */
    .navbar-light .navbar-nav .nav-link {
        color: white !important;
    }
`;
    async function handleSearch() {
        try {
            if (!searchText || !searchText.trim()) {
                setFaqDataS(null); // Clear FAQs if search text is empty
                setFaqData(null);
                setRenderSubcategoryInfo(false);
                return;
            }
            const response = await axios.get(`${backend_url}/FAQ/search?searchText=${searchText.trim()}`, {
                withCredentials: true,
            });

            setFaqDataS(response.data.FAQs);
            setRenderSubcategoryInfo(true); // Assuming you want to display search results
            return response.data; // Assuming the response contains an array of FAQs
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    }

    async function fetchFAQsBySubcategory() {
        try {
            if (selectedSubcategory) {
                console.log("Fetching FAQs for subcategory:", selectedSubcategory);
                const response = await axios.get(`${backend_url}/FAQ/?subCategory=${selectedSubcategory}`, {
                    withCredentials: true,
                });

                setFaqData(response.data.FAQs);
                setRenderSubcategoryInfo(response.data.subCategory);
                console.log("Subcategory Info:", response.data.subcategory);

                console.log("FAQsssss:", response.data.FAQs);
                console.log("Subcategory Info:", response.data.subcategoryInfo);
                console.log("FAQs:", response.data.FAQs);
                return response.data; // Assuming the response contains an array of FAQs
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };
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

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
    };

    const handleSubCategoryClick = async (subcategory) => {
        setSelectedCategory(null);
        setSelectedSubcategory(subcategory);

        // const FAQs = await fetchFAQsBySubcategory(subcategory);
        // setFaqData(FAQs);
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
                    navigate("/");
                    return;
                }

                const uid = localStorage.getItem("userId");
                const response = await axios.get(`${backend_url}/users/${uid}`, {
                    withCredentials: true,
                });
                setUserName(response.data.displayName);
            } catch (error) {
                console.log("Error fetching user data:", error);
                navigate("/");
            }
        }
        fetchFAQsBySubcategory();
        fetchUserData();
        fetchNotifications()

    }, [cookies.token, navigate, showNotification, renderSubcategoryInfo, selectedSubcategory]);

    const customStyles = `
    .purple-btn {
        color: purple;
        border-color: purple;
    }

    .custom-btn:hover,
    .custom-btn:focus,
    .custom-btn:active,
    .custom-btn.active {
        background-color: purple;
        color: white;
        border-color: purple;
    }
`;




    return (
        <>
            <GlobalStyle theme={theme} />

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
                                                    <div>
                                                        <label className="toggle-container">
                                                            <span className="toggle-label" style={{ color: theme === 'dark' ? 'black' : 'black' }}>
                                                                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                                            </span>
                                                        </label>
                                                    </div>
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
            <h3 style={{ textAlign: "center", margin: "40px", color: 'purple', fontFamily: "sans-serif", fontWeight: "bold" }}>
                Can't find what you're looking for? Search our FAQs below!
            </h3>
            {/* Search bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <InputGroup style={{ width: '400px', height: '50px' }}>
                    <FormControl
                        placeholder="My Laptop Froze!"
                        aria-label="Search FAQ"
                        aria-describedby="basic-addon2"
                        onChange={(e) => setsearchText(e.target.value)}
                        value={searchText}
                    />
                    <InputGroup.Text
                        id="basic-addon2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleSearch} // Trigger search on button click
                    >
                        <FaSearch />
                    </InputGroup.Text>
                </InputGroup>

            </div>
            {/* Categories and Subcategories */}
            <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                    <span style={{ fontWeight: "bold", fontFamily: "sans-serif" }} className="me-3">Categories:</span>
                    <div className="btn-group" role="group">
                        {/* Hardware Category */}
                        <button style={{ color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }}
                            onMouseEnter={() => setShowHardwareDropdown(true)}
                            onMouseLeave={() => setShowHardwareDropdown(false)}
                            type="button"
                            className={`btn btn-outline-primarypurple-btn ${selectedCategory === "Hardware" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("Hardware")}
                        >
                            Hardware
                        </button>
                        {/* Hardware Subcategories Dropdown */}
                        <div style={{ marginTop: "35px", color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }} className={`dropdown-menu ${showHardwareDropdown ? "show" : ""}`} onMouseEnter={() => setShowHardwareDropdown(true)} onMouseLeave={() => setShowHardwareDropdown(false)}>
                            <button onClick={() => handleSubCategoryClick("Desktops")} className="dropdown-item" type="button">Desktops</button>
                            {/* Add other Hardware subcategories */}
                            <button onClick={() => handleSubCategoryClick("Laptops")} className="dropdown-item" type="button">Laptops</button>
                            <button onClick={() => handleSubCategoryClick("Printers")} className="dropdown-item" type="button">Printers</button>
                            <button onClick={() => handleSubCategoryClick("Servers")} className="dropdown-item" type="button">Servers</button>
                            <button onClick={() => handleSubCategoryClick("Networking Equipment")} className="dropdown-item" type="button">Network Equipment</button>
                        </div>
                    </div>
                    <div className="btn-group" role="group">
                        {/* Software Category */}
                        <button style={{ color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }}
                            onMouseEnter={() => setShowSoftwareDropdown(true)}
                            onMouseLeave={() => setShowSoftwareDropdown(false)}
                            type="button"
                            className={`btn btn-outline-primarypurple-btn ${selectedCategory === "Software" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("Software")}
                        >
                            Software
                        </button>
                        {/* Software Subcategories Dropdown */}
                        <div style={{ marginTop: "35px", color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }} className={`dropdown-menu ${showSoftwareDropdown ? "show" : ""}`} onMouseEnter={() => setShowSoftwareDropdown(true)} onMouseLeave={() => setShowSoftwareDropdown(false)}>
                            <button onClick={() => handleSubCategoryClick("Operating Systems")} className="dropdown-item" type="button">Operating System</button>
                            {/* Add other Software subcategories */}
                            <button onClick={() => handleSubCategoryClick("Application Software")} className="dropdown-item" type="button">Application Software</button>
                            <button onClick={() => handleSubCategoryClick("Custom Software")} className="dropdown-item" type="button">Custom Software</button>
                            <button onClick={() => handleSubCategoryClick("Integration Issues")} className="dropdown-item" type="button">Integration Issues</button>
                        </div>
                    </div>
                    {/* Network Category */}
                    <div className="btn-group" role="group">
                        <button style={{ color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }}
                            onMouseEnter={() => setShowNetworkDropdown(true)}
                            onMouseLeave={() => setShowNetworkDropdown(false)}
                            type="button"
                            className={`btn btn-outline-primarypurple-btn ${selectedCategory === "Network" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("Network")}
                        >
                            Network
                        </button>
                        {/* Network Subcategories Dropdown */}
                        <div style={{ marginTop: "35px", color: "purple", fontWeight: "bold", fontFamily: "sans-serif", borderColor: "purple", borderWidth: "2px", borderRadius: "5px" }} className={`dropdown-menu ${showNetworkDropdown ? "show" : ""}`} onMouseEnter={() => setShowNetworkDropdown(true)} onMouseLeave={() => setShowNetworkDropdown(false)}>
                            <button onClick={() => handleSubCategoryClick("Email Issues")} className="dropdown-item" type="button">Email Issues</button>
                            {/* Add other Software subcategories */}
                            <button onClick={() => handleSubCategoryClick("Internet Connection Problems")} className="dropdown-item" type="button">Internet Connection Problems</button>
                            <button onClick={() => handleSubCategoryClick("Website Errors")} className="dropdown-item" type="button">Website Errors</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Display Selected Subcategory Info */}
            <div className="subcategory-container" style={{ marginTop: '160px', paddingLeft: '100px' }}>
                <h3 style={{ marginBottom: '20px', color: 'purple', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Frequently Asked Questions:</h3>
                {renderSubcategoryInfo ? (
                    <>
                        {faqData && (
                            <div>
                                <div>
                                    {faqData.map(FAQ => (
                                        <div key={FAQ._id} style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                                            <h4 style={{ color: 'purple', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{FAQ.title}</h4>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}>{FAQ.content}</p>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}><strong>Category:</strong> {FAQ.category}</p>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}><strong>Subcategory:</strong> {FAQ.subCategory}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {faqDataS && (
                            <div>
                                <div>
                                    {faqDataS.map(FAQ => (
                                        <div key={FAQ._id} style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                                            <h4 style={{ color: 'purple', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{FAQ.title}</h4>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}>{FAQ.content}</p>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}><strong>Category:</strong> {FAQ.category}</p>
                                            <p style={{ color: theme === 'dark' ? 'black' : 'black' }}><strong>Subcategory:</strong> {FAQ.subCategory}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!faqData && !faqDataS && (
                            <p style={{ textAlign: 'center', color: 'purple', fontFamily: 'sans-serif', fontWeight: 'bold' }}>No FAQs available for this subcategory</p>
                        )}
                    </>
                ) : (
                    // <p style={{ textAlign: 'center', color: 'purple', fontFamily: 'sans-serif', fontWeight: 'bold' }}>No selection made</p>
                    <p></p>
                )}
            </div>

        </>
    );
}