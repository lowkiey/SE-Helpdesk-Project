// ... (previous imports)
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatArea from '../components/ChatArea'; // Import the ChatArea component

//import socketManager from '../i/SocketManager'; // Import the SocketManager

const backend_url = "http://localhost:3000/api/v1";

const Chat = ({ agentId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${backend_url}/users/users/id`, {
          withCredentials: true,
        });

        console.log("Users response:", response.data);

        if (Array.isArray(response.data)) {
          setUsers(response.data.map((userId) => ({ _id: userId })));
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleSelectUser = (userId, event) => {
    event.preventDefault();
    setSelectedUserId(userId);
  };

  return (
    <div>
      <h1>Chats</h1>
      <table className="table" style={{ marginTop: '80px', width: '90%', margin: 'auto' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user._id}</td>
              <td>
                <button onClick={(event) => handleSelectUser(user._id, event)}>
                  Start Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <ChatArea userId={selectedUserId} />
        </div>
      )}
    </div>
  );
};

export default Chat;
