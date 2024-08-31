// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.get('/:eventId/chats', eventController.getEventChats); // New route to fetch chats


module.exports = router;
