const express = require('express');
const { DBConnection } = require('./database/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const passport = require('passport');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(passport.initialize());
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

const Message = require('./models/Message');

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

  socket.on('qaMessage', async ({ eventId, message, username }) => {
    try {
      const newMessage = await Message.create({ eventId, message, username });
      io.to(eventId).emit('newMessage', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('newReply', async ({ reply, replyTo, username, eventId }) => {
    try {
      const replyData = { message: reply, username };
      const updatedMessage = await Message.findOneAndUpdate(
        { _id: replyTo },
        { $push: { replies: replyData } },
        { new: true }
      );

      io.to(eventId).emit('newReply', updatedMessage);
    } catch (err) {
      console.error('Error saving reply:', err);
    }
  });

  socket.on('leaveRoom', (eventId) => {
    socket.leave(eventId);
    console.log(`User left room: ${eventId}`);
  });
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
