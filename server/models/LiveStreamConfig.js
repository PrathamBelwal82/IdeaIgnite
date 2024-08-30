const mongoose = require('mongoose');

const liveStreamConfigSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
});

const LiveStreamConfig = mongoose.model('LiveStreamConfig', liveStreamConfigSchema);

module.exports = LiveStreamConfig;
