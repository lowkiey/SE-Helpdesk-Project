import React, { useState, useEffect } from "react";
import axios from "axios";

const backend_url = "http://localhost:3000/api/v1";

const ChatArea = ({ userId, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    onSendMessage([...messages, { sender: 'user', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div>
      <h5>Chat with User {userId}</h5>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          style={{ flex: '1', marginRight: '10px' }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${backend_url}/users/users/id`, {
          withCredentials: true,
        });
  
        console.log("Users response:", response.data);
  
        if (Array.isArray(response.data)) {
          // Assuming response.data is an array of user IDs
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
              <td>
                {user._id}
              </td>
              <td>
                <button onClick={() => setSelectedUserId(user._id)}>Select</button>
                {/* Add any other actions you want for each user */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <ChatArea userId={selectedUserId} messages={messages} onSendMessage={setMessages} />
        </div>
      )}
    </div>
  );
};

export default Chat;