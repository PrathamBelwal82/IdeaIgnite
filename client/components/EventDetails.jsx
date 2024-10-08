import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QASession from './QASession'; // Import the component

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
    // Inside the EventDetails component
    <div className="event-details">
      <QASession />
      <h1>{event.description}</h1>
      {event.video && <video src={`http://localhost:4000/${event.video}`} controls width="300" />}
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
