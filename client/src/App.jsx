import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import HostEvent from '../components/HostEvent';
import AllEvents from '../components/AllEvents';
import EventDetails from '../components/EventDetails';
import Event from '../components/Event';
import Register from '../components/Register';
import QASession from '../components/QASession';
import Login from '../components/Login';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking the cookie
    const token = Cookies.get('token');
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar is persistent and will receive props for auth */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home and event pages are public */}
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/event/:id/details" element={<EventDetails />} />
          <Route path="/event/:id/QA" element={<QASession />} />
          <Route path="/events/category/:category" element={<AllEvents />} />

          {/* Protected routes (only accessible when logged in) */}
          <Route
            path="/host-event"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <HostEvent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
