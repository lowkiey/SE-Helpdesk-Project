// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import '../stylesheets/chat.css'; // Replace 'chat.css' with the actual name of your CSS file
import axios from 'axios';

// Define the Chat component
const Chat = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chats, setChats] = useState([]);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users'); // Assuming this is the correct endpoint for fetching users
        console.log('Users response:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch all chats when the component mounts or when a user is selected
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/tickets/ids'); // Update the endpoint
        console.log('Chats response:', response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [selectedUserId]);

  // Handle user click event
  const handleUserClick = (userId) => {
    console.log('Selected User ID:', userId);
    setSelectedUserId(String(userId)); // Convert userId to string for consistency
  };

  // Render the component
  return (
    <>
      {/* External CSS */}
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      {/* Main container */}
      <div className="container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              {/* People list */}
              <div className="people-list">
                <ul>
                  {users.map((user) => (
                    <li key={user.id} onClick={() => handleUserClick(user.id)}>
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chats */}
              <div className="chats">
                {chats.length === 0 ? (
                  <p>No chats available.</p>
                ) : (
                  chats.map((chat) => (
                    <div key={chat._id}>
                      <p>{chat.message}</p>
                      {/* Add more chat information as needed */}
                    </div>
                  ))
                )}
              </div>
              
              {/* Chat interface */}
              <div className="chat">
                <div className="selected-user">
                  {selectedUserId && (
                    <p>Selected User: {users.find(user => user.id === selectedUserId)?.name}</p>
                  )}
                </div>
  
                <div className="chat-history">
                  {/* The chat history section (if needed) */}
                </div>
  
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <input type="text" className="form-control" placeholder="Enter text here..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Export the Chat component
export default Chat;