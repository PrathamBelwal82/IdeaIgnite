const express = require('express');
const { DBConnection } = require('./database/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const Chat = require('./models/Chat');
const LiveStreamConfig = require('./models/LiveStreamConfig'); 
const app = express();
const server = http.createServer(app); // Use server with Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Your client URL
    methods: ['GET', 'POST'],
    credentials: true // Allow cookies and authentication headers
  }
});

dotenv.config();

const allowedOrigins = [
  'https://www.nerdjudge.me',
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routes
app.use('/', authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Fetch past messages
  Chat.find().then(messages => {
    socket.emit('chat history', messages);
  }).catch(err => {
    console.error('Error fetching chat history:', err);
  });

  socket.on('chat message', async (msg) => {
    try {
      const chat = new Chat({
        message: msg.message,
        sender: msg.sender // Optionally include sender info
      });
      await chat.save();

      // Broadcast message to all connected clients
      io.emit('chat message', chat);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/live-stream-url', async (req, res) => {
  try {
    const config = await LiveStreamConfig.findOne();
    if (config) {
      res.json({ url: config.url });
    } else {
      res.json({ url: '' });
    }
  } catch (err) {
    console.error('Error fetching live stream URL:', err);
    res.status(500).json({ message: 'Error fetching live stream URL' });
  }
});

app.post('/live-stream-url', async (req, res) => {
  const { url } = req.body;
  try {
    let config = await LiveStreamConfig.findOne();
    if (config) {
      config.url = url;
      await config.save();
    } else {
      config = new LiveStreamConfig({ url });
      await config.save();
    }
    res.status(200).json({ message: 'Live stream URL updated successfully' });
  } catch (err) {
    console.error('Error updating live stream URL:', err);
    res.status(500).json({ message: 'Error updating live stream URL' });
  }
});




const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const PORT1 = process.env.PORT || 3000;
app.listen(PORT1, () => {
  console.log(`Server is running on port ${PORT1}`);
});
