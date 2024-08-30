// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/live-events">
            Live Events
          </Button>
          <Button color="inherit" component={Link} to="/past-events">
            Past Events
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
