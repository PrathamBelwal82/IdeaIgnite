import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import '../src/QA.css'
const socket = io('http://localhost:4000'); // Adjust to your backend URL

function QASession() {
  const { id } = useParams(); // Get the event ID from the URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the room for the event
    socket.emit('joinRoom', id);
    
    // Remove previous listeners
    socket.off('loadMessages');
    socket.off('newMessage');

    // Load previous messages
    socket.on('loadMessages', (previousMessages) => {
      console.log('Previous messages:', previousMessages); // Log for debugging
      setMessages(previousMessages);
    });

    // Listen for new messages
    socket.on('newMessage', (msg) => {
      console.log('New message received:', msg); // Log for debugging
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveRoom', id); // Leave the current room on unmount
    };
  }, [id]); // Re-run when the event ID changes

  // Function to send a new message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('qaMessage', { eventId: id, message });
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div>
      <h3>Q&A Session</h3>
      <div className="message-box">
        {messages.map((msg, index) => (
          <p key={index}>{msg.message}</p> // Display the message
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update the message state
        placeholder="Ask a question..."
      />
      <button onClick={sendMessage}>Send</button> {/* Button to send the message */}
    </div>
  );
}

export default QASession;
