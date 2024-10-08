const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  description: { type: String, required: true },
  video: { type: String, required: true },
  images: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
