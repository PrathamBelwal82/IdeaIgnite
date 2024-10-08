import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>Welcome to IdeaIgnite</h1>
      <p>Your platform to host and discover exciting events!</p>
      <div className="cta-buttons">
        <Link to="/host-event" className="button">Host an Event</Link>
        <Link to="/all-events" className="button">View All Events</Link>
      </div>
    </div>
  );
}

export default Home;
