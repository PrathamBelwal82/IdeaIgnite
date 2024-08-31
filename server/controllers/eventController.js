// controllers/eventController.js

// controllers/eventController.js

const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

exports.createEvent = async (req, res) => {
  const { title, description, date } = req.body;
  const token = req.cookies.token; // Get the JWT token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. Please login.' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the user is a company
    if (decoded.userType !== 'company') {
      return res.status(403).json({ message: 'Only company users can create live events.' });
    }

    // Create a new event
    const event = new Event({
      title,
      description,
      date,
      createdBy: decoded.id,
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getEventChats = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const event = await Event.findById(eventId).populate('chats.user', 'email');
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({ chats: event.chats });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  


  