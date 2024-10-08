const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('video')) {
      cb(null, 'uploads/videos/');
    } else if (file.mimetype.startsWith('image')) {
      cb(null, 'uploads/images/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Export the upload middleware
const upload = multer({ storage });
module.exports = upload;
