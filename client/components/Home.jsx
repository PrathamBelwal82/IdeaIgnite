import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
//import Navbar from './Navbar'; // Import the Navbar
import "../src/Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default to "all"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      let endpoint = "http://localhost:4000/events";
      if (selectedCategory !== "all") {
        endpoint = `http://localhost:4000/events/category/${selectedCategory}`;
      }
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [selectedCategory]); // Refetch events when the selected category changes

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Set the selected category
  };

  if (!isLoggedIn) {
    return (
      <div className="homepage">
        <h1>Welcome to IdeaIgnite</h1>
        <p>Please login or register to explore events.</p>
        <div className="auth-options">
          <button
            className="auth-button login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="auth-button register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      
      

      <div className="events-section">
        {events.length === 0 ? (
          <p>No events found.</p>
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
                    <p className="event-funding">
                      {percentageFunded}% funded
                    </p>
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
    </div>
  );
}

export default Home;
