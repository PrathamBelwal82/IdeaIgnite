const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    totalFunds: {
      type: Number,
      required: true,
    },
    fundsRaises:{
      type: Number,
      default:0,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
