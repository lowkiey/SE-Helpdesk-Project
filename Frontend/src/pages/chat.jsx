import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaBell, FaUser } from "react-icons/fa";

const Chat = ({ agentId }) => {
  const hardcodedUserIds = ['user 1 requested to chat', 'user2 requested to chat', 'user3 requested to chat'];
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const userName = "John Doe";
  const navigate = useNavigate();


  const handleSelectUser = (userId) => {
    navigate("/chats"); // Update this with the actual path of your chat page

  };

  const handleUserIconClick = () => {
    setIsUserTabOpen(!isUserTabOpen);
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
              <Nav.Link as={Link} to="/tickets" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                Tickets
              </Nav.Link>
              
              <Nav.Link as={Link} to="/faq" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                FAQs
              </Nav.Link>

              <Nav.Link as={Link} to="/chat" style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginLeft: '50px' }}>
                my chats
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FaBell
                  onClick={() => setShowNotification(!showNotification)}
                  style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginRight: '20px' }}
                />
                {showNotification && (
                  <div style={{ position: 'absolute', top: '30px', right: '20px', width: '200px', height: '300px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px' }}>
                    {/* notification tab content */}
                    <div>
                      <p style={{ margin: '0', fontWeight: 'bold', fontSize: '20px' }}>Notifications:</p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <FaUser
                  onClick={handleUserIconClick}
                  style={{ fontSize: '24px', cursor: 'pointer', color: 'rgb(166, 0, 255)', marginRight: '-40px' }}
                />
                {isUserTabOpen && (
                  <div style={{ position: 'absolute', top: '30px', right: '-200px', width: '200px', height: '100px', backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', borderRadius: '0px', padding: '10px' }}>
                    {/* User tab content */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ marginRight: '10px', borderRadius: '50%', overflow: 'hidden' }}>
                        {/* Placeholder image */}
                        <img src="https://via.placeholder.com/50" alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold', marginTop: '0' }}>{userName}</p>
                        <br />
                        <Link to="/" style={{ color: 'rgb(209, 151, 240)', textDecoration: 'none' }}>Logout</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>        </Container>
      </Navbar>

      <div className="chat-container">
        <h1>Chats</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hardcodedUserIds.map((userId, index) => (
              <tr key={userId}>
                <td>{index + 1}</td>
                <td>{userId}</td>
                <td>
                <button className="btn btn-primary start-chat-btn" onClick={() => handleSelectUser(userId)}>
                    Start Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Chat;
