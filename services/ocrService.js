// services/ocrService.js
const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

/**
 * Perform OCR on a PNG image using Tesseract
 * @param {string} imagePath
 * @returns {Promise<string>} Extracted text
 */
async function performOcr(imagePath) {
  try {
    console.log(`Performing OCR on ${imagePath}...`);
    const text = await tesseract.recognize(imagePath, config);
    console.log("OCR successful.");
    return text;
  } catch (error) {
    console.error("Error during Tesseract OCR:", error.message);
    throw new Error("Tesseract OCR process failed.");
  }
}

module.exports = { performOcr }; 