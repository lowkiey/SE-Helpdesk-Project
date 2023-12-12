import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";

function App() {
  return (
    <Routes>
      {/* Set the login page as the default */}
      <Route path="/" element={<Login />} />

      {/* Other routes */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/register" element={<Signup />} />
<<<<<<< HEAD

=======
>>>>>>> origin/george_new
    </Routes>
  );
}

export default App;