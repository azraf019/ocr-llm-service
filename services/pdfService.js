// services/pdfService.js

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs/promises');

const execAsync = promisify(exec);

/**
 * Convert PDF to PNG images (one per page)
 * @param {string} pdfPath
 * @returns {Promise<string[]>} Array of image paths
 */
async function convertPdfToImages(pdfPath) {
    try {
        const outputDir = path.dirname(pdfPath);
        const baseName = path.basename(pdfPath, path.extname(pdfPath));
        const outputPattern = path.join(outputDir, `${baseName}_page`);
        
        // Use pdftoppm command to convert PDF to PNG images at a balanced resolution
        const command = `pdftoppm -png -r 400 "${pdfPath}" "${outputPattern}"`;
        
        console.log(`Executing: ${command}`);
        await execAsync(command);
        
        // Get all generated PNG files
        const files = await fs.readdir(outputDir);
        const imageFiles = files
            .filter(file => file.startsWith(`${baseName}_page`) && file.endsWith('.png'))
            .sort((a, b) => {
                // Sort by page number
                const pageA = parseInt(a.match(/_page-(\d+)/)?.[1] || '0');
                const pageB = parseInt(b.match(/_page-(\d+)/)?.[1] || '0');
                return pageA - pageB;
            })
            .map(file => path.join(outputDir, file));
        
        console.log(`Generated ${imageFiles.length} images:`, imageFiles);
        return imageFiles;
        
    } catch (error) {
        console.error('Error converting PDF to images:', error);
        throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
}

module.exports = { convertPdfToImages }; 