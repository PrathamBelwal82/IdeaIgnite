import React, { useState } from 'react';
import { TextField, Button, Container, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState(''); // Correct variable name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('normal'); // Default to 'normal'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        firstName,
        lastName,
        userName, // Use correct variable name
        email,
        password,
        userType
      });

      // Log the entire response object
      console.log(response);

      // Ensure the response data structure matches your expectations
      const { token, userId, userName: responseUserName, userType: responseUserType } = response.data;

      // Store token and user information in cookies
      Cookies.set('token', token, { expires: 15 });
      Cookies.set('userId', userId, { expires: 15 });
      Cookies.set('userName', responseUserName, { expires: 15 }); // Use correct variable name
      Cookies.set('userType', responseUserType, { expires: 15 });

      navigate('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          fullWidth
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Username" // Correct label name
          fullWidth
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)} // Use correct state updater
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Typography variant="h6">User Type</Typography>
        <RadioGroup
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          row
        >
          <FormControlLabel value="normal" control={<Radio />} label="Normal User" />
          <FormControlLabel value="company" control={<Radio />} label="Company" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
