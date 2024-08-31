// components/CreateEventForm.jsx

import React, { useState } from 'react';
import axiosInstance from '../src/axiosInstance'; 
import Cookies from 'js-cookie';

const CreateEventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Send request to the backend to create a new event
      const response = await axiosInstance.post('/events/create',
        { title, description, date },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>Create a Live Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateEventForm;
