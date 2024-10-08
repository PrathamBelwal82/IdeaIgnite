const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  category: {type: String, required: true},
  company: {type: String, required: true},
  description: { type: String, required: true },
  video: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
