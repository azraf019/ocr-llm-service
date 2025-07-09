// services/ocrService.js

const fs = require('fs/promises');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const config = require('../config');

/**
 * Perform OCR on a PNG image using PaddleOCR API
 * @param {string} imagePath
 * @returns {Promise<string>} Extracted text
 */
async function performOcr(imagePath) {
    const fileBuffer = await fs.readFile(imagePath);
    const formData = new FormData();
    formData.append('image', fileBuffer, {
        filename: path.basename(imagePath),
        contentType: 'image/png',
    });
    const response = await axios.post(config.paddleOcrUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 30000
    });
    if (response.data && Array.isArray(response.data.results)) {
        return response.data.results.map(line => line.text).join('\n');
    }
    return '';
}

module.exports = { performOcr }; 