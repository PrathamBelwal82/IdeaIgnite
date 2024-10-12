import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      const { token, userId, userType } = response.data;
  
      Cookies.set('token', token, { expires: 15 });
      Cookies.set('userId', userId, { expires: 15 });
      Cookies.set('userType', userType, { expires: 15 });
  
      // Update the logged-in state
      setIsLoggedIn(true);
  
      navigate('/'); // Redirect to home after logging in
    } catch (error) {
      navigate('/register');
      console.error(error.response.data.message);
    }
  };
  

  return (
    <Container component={Paper} elevation={3} sx={{ p: 4, mt: 8, maxWidth: 400 }}>
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </Box>
    </Container>
  );
}

export default Login;
