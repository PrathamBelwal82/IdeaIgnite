import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from '../components/Login';
import Register from '../components/Register';
import CreateEventForm from '../components/CreateEventForm.jsx'; // Import the CreateEventForm component
import EventChat from '../components/EventChat'; // Import the EventChat component
import LiveEvents from '../components/LiveEvents';
import DashBoard from '../components/Dashboard';
import { getCookie } from '../utils/getCookies';

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
          <Route path="/live-events" element={<LiveEvents />} />
          {/* Protected Routes */}
          <Route
            path="/create-event"
            element={<ProtectedRoute element={<CreateEventForm />} />}
          />
          <Route
            path="/event/:eventId/chat"
            element={<ProtectedRoute element={<EventChat />} />}
          />
          <Route
            path="dashboard"
            element={<ProtectedRoute element={<DashBoard />} />}
          />

          <Route path="/" element={getCookie('token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
