// components/EventChat.jsx

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../src/axiosInstance'; 
import Cookies from 'js-cookie';

const socket = io('http://localhost:4000', { withCredentials: true }); // Adjust URL as needed

const EventChat = ({ eventId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    
    // Fetch existing chats from the server
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/events/${eventId}/chats`);
        setMessages(response.data.chats);
      } catch (error) {
        console.error('Error fetching chats:', error.message);
      }
    };

    fetchChats();

    // Join the event room
    socket.emit('joinEvent', { eventId });

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [eventId, token]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { eventId, message });
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div>
      <h3>Event Discussion</h3>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.message} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default EventChat;
