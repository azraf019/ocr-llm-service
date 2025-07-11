// Load environment variables and config
require('dotenv').config({ path: './config/.env' });
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const config = require('./config');
const processRoute = require('./routes/process');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = config.port;

// Add JSON body parser with a higher limit for base64 strings
app.use(express.json({ limit: '20mb' }));

// Ensure uploads directory exists
fs.mkdir('uploads', { recursive: true }).catch(console.error);

// Mount routes
app.use('/api/process', processRoute);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`OCR & LLM service running on http://localhost:${port}`);
});