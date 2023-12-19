// ChatArea.jsx
import React, { useState, useEffect } from 'react';
import socketManager from '../i/SocketManager'; // Import the SocketManager


const ChatArea = ({ userId, agentId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Subscribe to chat events
    const handleMessage = (data) => {
      // Handle incoming messages and update the state
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socketManager.socket.on('message', handleMessage);

    // Cleanup function to unsubscribe from events when the component unmounts
    return () => {
        socketManager.socket.off('message', handleMessage);
    };
  }, []);

  const handleSendMessage = () => {
    // Send the new message to the server
    socketManager.sendMessage(userId || agentId, newMessage);

    // Clear the input field
    setNewMessage('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
