// routes/process.js

const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');
const ocrService = require('../services/ocrService');
const llmService = require('../services/llmService');
const { safeUnlink } = require('../utils/fileUtils');

// POST /api/process
router.post('/', async (req, res, next) => {
    try {
        // Input validation
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file provided.' });
        }
        if (!req.body.prompt || typeof req.body.prompt !== 'string' || !req.body.prompt.trim()) {
            await safeUnlink(req.file.path);
            return res.status(400).json({ message: 'A prompt is required.' });
        }

        const pdfPath = req.file.path;
        const userPrompt = req.body.prompt.trim();
        let imagePaths = [];
        let structuredJSON;

        try {
            imagePaths = await pdfService.convertPdfToImages(pdfPath);
            let extractedText = '';
            for (const imagePath of imagePaths) {
                extractedText += await ocrService.performOcr(imagePath) + '\n\n';
            }
            structuredJSON = await llmService.getStructuredData(extractedText, userPrompt);
        } finally {
            // Always clean up temp files
            await safeUnlink(pdfPath);
            for (const imagePath of imagePaths) {
                await safeUnlink(imagePath);
            }
        }
        return res.status(200).json(structuredJSON);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 