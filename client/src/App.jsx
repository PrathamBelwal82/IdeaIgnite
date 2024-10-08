import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import HostEvent from '../components/HostEvent';
import AllEvents from '../components/AllEvents';
import EventDetails from '../components/EventDetails';
import Event from '../components/Event';
import QASession from '../components/QASession';
import './App.css'; 
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar will be persistent across all components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host-event" element={<HostEvent />} />
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
