import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication cookies
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('userType');

    // Redirect to login page
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">IdeaIgnite</Link>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/host-event">Host an Event</Link></li>
        <li><Link to="/all-events">All Events</Link></li>
        {Cookies.get('token') && (
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;


