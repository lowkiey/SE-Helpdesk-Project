// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to the '/register' path */}
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        {/* Add more routes for other pages */}
      </Routes>
    </Router>
  );
}

export default App;
