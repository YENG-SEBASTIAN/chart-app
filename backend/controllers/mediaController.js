const multer = require('multer');
const path = require('path');

// Configure multer to store media files in 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp
    }
});

const fileFilter = (req, file, cb) => {
    // Only accept images and videos
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50, // limit file size to 50MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
