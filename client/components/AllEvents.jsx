import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


const AllEvents = () => {
  const { category } = useParams(); // Get category from URL
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`http://localhost:4000/events/category/${category}`);
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, [category]);

  return (
    <div className="events-section">
      <h1>Events in {category}</h1>
      {events.length === 0 ? (
        <p>No events found in this category.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const percentageFunded = ((event.fundsRaises / event.totalFunds) * 100).toFixed(2); // Calculate percentage funded
            const timeLeft = new Date(event.endDate) - new Date(); // Time left in milliseconds
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24)); // Convert to days

            return (
              <div key={event._id} className="event-card">
                <Link to={`/event/${event._id}`}>
                  <img
                    src={`http://localhost:4000/${event.thumbnail}`}
                    alt={event.company}
                    className="event-thumbnail"
                  />
                  <h2 className="event-title">{event.company}</h2>
                  <p className="event-category">{event.category}</p>
                  <p className="event-funding">{percentageFunded}% funded</p>
                  <p className="event-time-left">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Event ended"}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
