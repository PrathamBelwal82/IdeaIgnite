const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const Event = require('../models/Event');

// GET route to fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch events by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const events = await Event.find({ category });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query; // Extract the search query from the request
    if (!query) {
      return res.status(400).json({ message: 'No search query provided' });
    }

    // Search by event name or category (or any other field)
    const results = await Event.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },   // Case-insensitive search in the "name" field
        { category: { $regex: query, $options: 'i' } } // Case-insensitive search in the "category" field
      ]
    });

    res.json(results); // Return the filtered search results
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Server error while fetching search results' });
  }
});

// POST route to create a new event
// POST route to create a new event
router.post('/', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req, res) => {
  try {
    const { company, category, description, totalFunds, endDate } = req.body;
    const videoPath = req.files['video'] ? req.files['video'][0].path : null;
    const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

    const event = new Event({
      company,
      category,
      description,
      totalFunds, // Add total funds to the event model
      endDate, // Add end date to the event model
      video: videoPath,
      images: imagePaths,
      thumbnail: thumbnailPath
    });

    await event.save();
    res.status(201).json({ message: 'Event successfully created!', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Export the router
module.exports = router;
