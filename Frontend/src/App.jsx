import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import FAQ from "./pages/FAQs";
import Reports from "./pages/Reports";
import Tickets from "./pages/tickets";

function App() {
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

    </Routes>
  );
}

export default App;