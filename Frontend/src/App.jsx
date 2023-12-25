import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Homepage from './pages/HomePage';
import Login from './pages/login';
import Signup from './pages/register';
import FAQ from './pages/FAQs';
import Reports from './pages/Reports';
import Tickets from './pages/tickets';
import Chat from './pages/chat';
import ChatPage from './chat/chatPage';
import Agent from './pages/agent';
import IssuePage from './pages/issuePage';
import ViewReports from './pages/viewReport';
import UpdateTickets from './pages/updateTickets';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const userId = localStorage.getItem('userId');

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
      <Route path="/home" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/issue" element={<IssuePage />} />
      <Route path="/viewReport" element={<ViewReports />} />
      <Route path="/chats/:userId" element={<ChatPage socket={socket} />} />
      <Route path="/agent" element={<Agent />} />
      <Route path="/updateTickets" element={<UpdateTickets />} />

    </Routes>
  );
}

export default App;
