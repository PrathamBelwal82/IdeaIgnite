import React, { useState } from 'react';
import { TextField, Button, Container, Typography, RadioGroup, FormControlLabel, Radio, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('normal');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/register', {
        firstName,
        lastName,
        userName,
        email,
        password,
        userType,
      });

      const { token, userId, userName: responseUserName, userType: responseUserType } = response.data;

      Cookies.set('token', token, { expires: 15 });
      Cookies.set('userId', userId, { expires: 15 });
      Cookies.set('userName', responseUserName, { expires: 15 });
      Cookies.set('userType', responseUserType, { expires: 15 });

      navigate('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container component={Paper} elevation={3} sx={{ p: 4, mt: 8, maxWidth: 500 }}>
      <Typography variant="h4" align="center" gutterBottom>Register</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="First Name"
          fullWidth
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Username"
          fullWidth
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
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
        <Typography variant="h6">User Type</Typography>
        <RadioGroup
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          row
        >
          <FormControlLabel value="Supporter" control={<Radio />} label="Supporter" />
          <FormControlLabel value="Creator" control={<Radio />} label="Creator" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default Register;
