import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Tickets from "./pages/reports";
import Chat from "./pages/chat";


function App() {
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
