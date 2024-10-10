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
