import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../src/EventDetails.css';

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
      {/* Centered Product Name */}
      <h1 className="event-title">{event.company}</h1>
      
      {/* Video/Thumbnail and Donation Box side by side */}
      <div className="video-donation-container">
        <div className="video-container">
          {event.video ? (
            <video
              src={`http://localhost:4000/${event.video}`}
              controls
              width="100%"
              style={{ maxWidth: '600px' }}
            />
          ) : (
            <img
              src={`http://localhost:4000/${event.thumbnail}`}
              alt="Event Thumbnail"
              width="100%"
              style={{ maxWidth: '600px' }}
            />
          )}
        </div>
        <div className="donation-box">
          <h2>Support Us</h2>
          <p>Your contributions help us succeed!</p>
          <button>Donate $10</button>
          <button>Donate $20</button>
          <button>Donate $50</button>
        </div>
      </div>

      {/* Product Description */}
      <div className="event-description">
        <h2>About the Product</h2>
        <p>{event.description}</p>
      </div>

      {/* Images displayed in two-column layout */}
      <div className="event-images">
        {event.images.map((image, imgIndex) => (
          <img
            key={imgIndex}
            src={`http://localhost:4000/${image}`}
            alt={`Event ${imgIndex}`}
            className="event-image"
          />
        ))}
      </div>
    </div>
  );
}

export default EventDetails;
