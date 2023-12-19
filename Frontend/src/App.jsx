import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Report from "./pages/ReportPage";
import Issues from "./pages/IssuePage";

function App() {
  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
      <Route path = "/ReportPage" element= {<Report />}/> 
      <Route path = "/IssuePage" element= {<Issues />}/> 

    </Routes>
  );
}

export default App;