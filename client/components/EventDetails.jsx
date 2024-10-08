import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QASession from './QASession'; // Import the component
import '../src/EventDetails.css'
function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:4000/events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-details">
      <div className="video-donation-container">
        <div className="video-container">
          <h1>{event.description}</h1>
          {event.video && (
            <video
              src={`http://localhost:4000/${event.video}`}
              controls
              width="100%"
              style={{ maxWidth: '600px' }}
            />
          )}
        </div>
        <div className="donation-placeholder">
          <h2>Support Us</h2>
          <p>Your contributions help us succeed!</p>
          {/* Placeholder for donation buttons or links */}
          <button>Donate $10</button>
          <button>Donate $20</button>
          <button>Donate $50</button>
        </div>
      </div>
      <div className="event-images">
        {event.images.map((image, imgIndex) => (
          <img
            key={imgIndex}
            src={`http://localhost:4000/${image}`}
            alt="Event"
            width="100px"
            style={{ margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default EventDetails;
