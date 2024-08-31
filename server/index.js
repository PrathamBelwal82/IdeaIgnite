const express = require('express');
const { DBConnection } = require('./database/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io
const io = socketIo(server, {
  cors: {
    origin: 'https://idea-ignite-2.vercel.app', // Your client URL
    methods: ['GET', 'POST'],
    credentials: true // Allow cookies and authentication headers
  }
});

const allowedOrigins = [
  'https://idea-ignite-2.vercel.app',
  'http://localhost:5173' // Add more origins as needed
];

// CORS middleware configuration
app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is in the allowedOrigins array
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies and authentication headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
DBConnection();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit with failure
});

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes=require('./routes/eventRoutes')
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routes
app.use('/', authRoutes);
app.use('/events',eventRoutes);

// Socket.IO for real-time chat feature in live events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for chat messages
  socket.on('joinEvent', (eventId) => {
    socket.join(eventId);
    console.log(`User joined event room: ${eventId}`);
  });

  socket.on('chatMessage', (data) => {
    // Save the chat message to a database here if needed
    const { eventId, message, user } = data;
    
    // Broadcast the message to others in the room
    io.to(eventId).emit('chatMessage', { message, user });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
