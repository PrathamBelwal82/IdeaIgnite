import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../src/Allevents.css'; // Add your CSS file

function AllEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="all-events">
      <h1>All Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <Link to={`/event/${event._id}`}>
                <img
                  src={`http://localhost:4000/${event.thumbnail}`}
                  alt={event.company}
                  className="event-thumbnail"
                />
                <h2 className="event-title">{event.company}</h2>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllEvents;
