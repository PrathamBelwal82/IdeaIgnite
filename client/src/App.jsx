import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar will be persistent across all components */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            
              <Home />
            
          } />
          <Route path="/host-event" element={
            <ProtectedRoute>
              <HostEvent />
            </ProtectedRoute>
          } />
          <Route path="/all-events" element={<AllEvents />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/event/:id/details" element={<EventDetails />} />
          <Route path="/event/:id/QA" element={<QASession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
