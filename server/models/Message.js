const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  message: { type: String, required: true },
  sender: { type: String }, // Optional, for storing the sender's name
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
