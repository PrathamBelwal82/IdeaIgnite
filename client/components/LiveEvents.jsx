import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { getCookie } from '../utils/getCookies';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/live-events', {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`, // Add token in headers
          },
        });
        setEvents(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <List>
        {events.map((event) => (
          <ListItem key={event._id} button component="a" href={`/events/${event._id}`}>
            <ListItemText primary={event.title} secondary={event.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Events;
