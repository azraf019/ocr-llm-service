// services/llmService.js

const axios = require('axios');
const config = require('../config');

/**
 * Get structured data from LLM based on extracted text and user prompt
 * @param {string} text
 * @param {string} prompt
 * @returns {Promise<Object>} Structured JSON
 */
async function getStructuredData(text, prompt) {
    const fullPrompt = `\nBased on the following text, please extract the information according to the user's request.\n\nUser's Request: "${prompt}"\n\nExtracted Text:\n---\n${text}\n---\n\nReturn ONLY the structured JSON object based on the request. Do not include any other text, explanations, or markdown formatting.\n`;
    const response = await axios.post(config.ollamaUrl, {
        model: "llama3",
        prompt: fullPrompt,
        stream: false,
        format: "json"
    }, { timeout: 60000 });
    try {
        return JSON.parse(response.data.response);
    } catch (err) {
        throw new Error('Failed to parse LLM response as JSON.');
    }
}

module.exports = { getStructuredData }; 