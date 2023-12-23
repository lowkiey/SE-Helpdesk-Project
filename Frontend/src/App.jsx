import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";

import Chat from "./chat/chatPage";
import ChatPage from "./pages/chat";
import Tickets from "./pages/tickets";

import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', { query: { userId } });
    setSocket(socketInstance);

    // Listen for events emitted by the server
    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('message', (data) => {
      console.log(`Received message: ${data}`);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userId]);

  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/HomePage" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/reports" element={<Tickets />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/tickets" element={<Tickets />} />

      {/* Pass the socket instance as a prop to the Chat component */}
      <Route
        path="/chats"
        element={<Chat socket={socket} />}
      />
    </Routes>
  );
}

export default App;
