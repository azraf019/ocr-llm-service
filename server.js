// Load environment variables and config
require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const config = require('./config');
const processRoute = require('./routes/process');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = config.port;

// Multer config: limit file size to 10MB, accept only PDFs
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }
        cb(null, true);
    }
});

// Ensure uploads directory exists
fs.mkdir('uploads', { recursive: true }).catch(console.error);

// Mount routes
app.use('/api/process', upload.single('pdf'), processRoute);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`OCR & LLM service running on http://localhost:${port}`);
});