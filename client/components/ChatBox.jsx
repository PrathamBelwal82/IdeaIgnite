import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { getCookie } from '../utils/getCookies';
import { Container, Typography, TextField, Button, Paper, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

// Replace with your server URL
const SOCKET_SERVER_URL = 'http://localhost:4000'; 
const LIVE_STREAM_URL_ENDPOINT = 'http://localhost:4000/chatbox';

function ChatBox() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const [newLiveStreamUrl, setNewLiveStreamUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const userName = getCookie('userName');
  const userType = getCookie('userType');

  useEffect(() => {
    // Initialize the socket connection
    const socketIo = io(SOCKET_SERVER_URL);

    socketIo.on('connect', () => {
      console.log('Connected to server');
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socketIo.on('chat message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socketIo.on('chat history', (history) => {
      setMessages(history);
    });

    setSocket(socketIo);

    // Fetch the current live stream URL from the backend
    setLoading(true);
    axios.get(LIVE_STREAM_URL_ENDPOINT)
      .then(response => {
        setLiveStreamUrl(response.data.url);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching live stream URL:', error);
        setLoading(false);
      });

    // Clean up on component unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    socket.emit('chat message', { message: inputMessage, sender: userName });
    setInputMessage('');
  };

  const handleUrlChange = (e) => {
    e.preventDefault();
    axios.post(LIVE_STREAM_URL_ENDPOINT, { url: newLiveStreamUrl })
      .then(() => {
        setLiveStreamUrl(newLiveStreamUrl);
        setNewLiveStreamUrl('');
      })
      .catch(error => {
        console.error('Error updating live stream URL:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Chat Box</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box mb={2}>
          {liveStreamUrl && (
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h5" gutterBottom>Live Stream</Typography>
              <iframe
                width="100%"
                height="315"
                src={liveStreamUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Live Stream"
              ></iframe>
            </Paper>
          )}
        </Box>
      )}

      {userType === 'company' && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h5" gutterBottom>Update Live Stream URL</Typography>
          <form onSubmit={handleUrlChange}>
            <TextField
              fullWidth
              type="text"
              value={newLiveStreamUrl}
              onChange={(e) => setNewLiveStreamUrl(e.target.value)}
              placeholder="Enter new live stream URL"
              required
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Update URL
            </Button>
          </form>
        </Paper>
      )}

      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>Messages</Typography>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${msg.sender}: ${msg.message}`} />
              </ListItem>
            ))}
          </List>
        </Box>
        <form onSubmit={handleSendMessage}>
          <TextField
            fullWidth
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter message"
            required
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
            Send
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ChatBox;
