import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Tickets from "./pages/tickets";
import Createticket from "./pages/createTicket";

function App() {
  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/createticket" element={<Createticket />} /> 
    </Routes>
  );
}

export default App;