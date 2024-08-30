import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from '../components/Login';
import Register from '../components/Register';
import ChatBox from '../components/ChatBox';
import Dashboard from '../components/DashBoard';
import { getCookie } from '../utils/getCookies';
import Navbar from "../components/NavBar";
// Higher-order component to protect routes
const ProtectedRoute = ({ element, ...rest }) => {
  const token = getCookie('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/chatbox"
            element={<ProtectedRoute element={<ChatBox />} />}
          />
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
