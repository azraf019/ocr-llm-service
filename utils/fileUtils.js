// utils/fileUtils.js

const fs = require('fs/promises');

/**
 * Safely delete a file if it exists
 * @param {string} filePath
 */
async function safeUnlink(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(`Failed to delete file ${filePath}: ${err.message}`);
        }
    }
}

module.exports = { safeUnlink }; 