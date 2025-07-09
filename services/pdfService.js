// services/pdfService.js

const { Poppler } = require('pdf-poppler');
const path = require('path');
const fs = require('fs/promises');

/**
 * Convert PDF to PNG images (one per page)
 * @param {string} pdfPath
 * @returns {Promise<string[]>} Array of image paths
 */
async function convertPdfToImages(pdfPath) {
    const poppler = new Poppler();
    const outputFile = path.join(path.dirname(pdfPath), path.basename(pdfPath, path.extname(pdfPath)));
    const options = { pngFile: true };
    await poppler.pdfToCairo(pdfPath, outputFile, options);
    const dir = path.dirname(pdfPath);
    const files = await fs.readdir(dir);
    return files
        .filter(file => file.startsWith(path.basename(outputFile)) && file.endsWith('.png'))
        .map(file => path.join(dir, file));
}

module.exports = { convertPdfToImages }; 