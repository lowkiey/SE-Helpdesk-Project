import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Tickets from "./pages/reports";
import Chat from "./pages/chat";
import io from "socket.io-client";

import React, { useEffect, useState } from "react";



function App() {


  const[socket,setSocket] = useState(null); 
  // const userId = sessionStorage.getItem('userId');
  // console.log("userid:" + userId)

  const userId = localStorage.getItem("userId");
   console.log("user id "+ userId);



    useEffect(() => {
      
    const socketInstance = io('http://localhost:3000', {query: {userId}});
    setSocket(socketInstance);
    
  
    // listen for events emitted by the server
  
    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });
  
    socketInstance.on('message', (data) => {
      console.log("Received message: ${data}");
    });
  
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // const userId = sessionStorage.getItem('userId');
  // console.log(userId);
  
  // var socket = io.connect('http://localhost:3000');
  // console.log("socket " + socket.id);
  

  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/HomePage" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/reports" element={<Tickets />} />
      <Route path="/chats" element={<Chat/>} />


      {/* New route for the chat component */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
