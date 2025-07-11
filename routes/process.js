// routes/process.js

const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const pdfService = require('../services/pdfService');
const ocrService = require('../services/ocrService');
const llmService = require('../services/llmService');
const { safeUnlink } = require('../utils/fileUtils');

// POST /api/process
router.post('/', async (req, res, next) => {
    let pdfPath;
    try {
        // Input validation
        if (!req.body.pdf || typeof req.body.pdf !== 'string') {
            return res.status(400).json({ message: 'No PDF data provided in base64 format.' });
        }
        if (!req.body.prompt || typeof req.body.prompt !== 'string' || !req.body.prompt.trim()) {
            return res.status(400).json({ message: 'A prompt is required.' });
        }

        // Decode base64 and write to a temporary file
        const pdfBuffer = Buffer.from(req.body.pdf, 'base64');
        const tempFilename = `${uuidv4()}.pdf`;
        pdfPath = path.join('uploads', tempFilename);
        await fs.writeFile(pdfPath, pdfBuffer);

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
            if (pdfPath) await safeUnlink(pdfPath);
            for (const imagePath of imagePaths) {
                await safeUnlink(imagePath);
            }
        }
        return res.status(200).json(structuredJSON);
    } catch (error) {
        // If a temp file was created before the error, try to clean it up
        if (pdfPath) await safeUnlink(pdfPath);
        next(error);
    }
});

module.exports = router; 