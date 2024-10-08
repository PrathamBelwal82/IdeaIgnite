import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../src/Home.css';

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [' Earth', ' Art', ' Comics', ' Technology'];

  useEffect(() => {
    const fetchEvents = async () => {
      let endpoint = 'http://localhost:4000/events';
      if (selectedCategory !== 'all') {
        endpoint = `http://localhost:4000/events/category/${selectedCategory}`;
      }
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  return (
    <div className="homepage">
      <h1>Welcome to IdeaIgnite</h1>
      <p>Your platform to host and discover exciting projects!  Sorry the website is down for some time will bring it back up asap</p>
      <nav className="category-navbar">
        <ul>
          <li onClick={() => setSelectedCategory('all')}>All</li>
          {categories.map((category) => (
            <li key={category} onClick={() => setSelectedCategory(category)}>
              {category}
            </li>
          ))}
        </ul>
      </nav>

     <div className="events-section">
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
                  <p className="event-category">{event.category}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
