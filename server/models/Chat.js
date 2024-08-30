const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, required: true }, // You can store user information if needed
});

module.exports = mongoose.model('Chat', chatSchema);
