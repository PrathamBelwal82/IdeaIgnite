import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h2>
                <Link to={`/event/${event._id}`}>{event.description}</Link>
              </h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllEvents;
