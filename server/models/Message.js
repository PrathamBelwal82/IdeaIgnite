const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  username: String,
  message: String,
});

const messageSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: String,
  username: String,
  replies: [replySchema], // Store replies as an array
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
