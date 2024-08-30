import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Container, Paper } from '@mui/material';

// Replace with your server URL
const LIVE_EVENTS_ENDPOINT = 'http://localhost:4000/live-events';

function LiveEventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(LIVE_EVENTS_ENDPOINT)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching live events:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Live Events</Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {events.map(event => (
            <ListItem button component={Link} to={`/live-events/${event.id}`} key={event.id}>
              <ListItemText primary={event.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default LiveEventsList;
