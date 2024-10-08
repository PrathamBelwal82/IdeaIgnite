const express = require('express');
const { DBConnection } = require('./database/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io'); // Import Socket.io

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Update with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const allowedOrigins = ['http://localhost:5173'];

// CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
DBConnection();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const Message = require('./models/Message'); // Import the Message model

io.on('connection', (socket) => {
  socket.on('joinRoom', async (eventId) => {
    socket.join(eventId);
    console.log(`User joined room: ${eventId}`);

    try {
      const previousMessages = await Message.find({ eventId }).sort({ timestamp: 1 });
      socket.emit('loadMessages', previousMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      socket.emit('loadMessages', []); // Send an empty array if an error occurs
    }
  });
  socket.on('qaMessage', async ({ eventId, message }) => {
    try {
      const newMessage = await Message.create({ eventId, message }); // Save the message to DB
      io.to(eventId).emit('newMessage', newMessage); // Broadcast the new message
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
  
  socket.on('leaveRoom', (eventId) => {
    socket.leave(eventId);
    console.log(`User left room: ${eventId}`);
  });

  // Other socket events (like qaMessage)...
});


// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routes
app.use('/', authRoutes);
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => { // Use server instead of app
  console.log(`Server is running on port ${PORT}`);
});
