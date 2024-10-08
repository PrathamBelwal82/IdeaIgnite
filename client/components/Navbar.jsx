import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">IdeaIgnite</Link>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/host-event">Host an Event</Link></li>
        <li><Link to="/all-events">All Events</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
