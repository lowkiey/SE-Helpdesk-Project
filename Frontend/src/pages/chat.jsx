import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Chat = ({ agentId }) => {
  const hardcodedUserIds = ['user1', 'user2', 'user3']; // Replace with your actual user IDs
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const handleSelectUser = (userId) => {
    navigate('/chats');
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
          {hardcodedUserIds.map((userId, index) => (
            <tr key={userId}>
              <td>{index + 1}</td>
              <td>{userId}</td>
              <td>
                <button onClick={() => handleSelectUser(userId)}>
                  Start Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default Chat;
