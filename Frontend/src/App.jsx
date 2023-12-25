import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Reports from "./pages/Reports";
import ReportPage from "./pages/ReportPage";
import IssuePage from "./pages/IssuePage";



function App() {
  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/reports" element={<Reports/>} />
      <Route path = "/ReportPage" element= {<ReportPage/>}/> 
      <Route path = "/IssuePage" element= {<IssuePage/>}/> 



    </Routes>
  );
}

export default App;