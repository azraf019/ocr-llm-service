// config/index.js

module.exports = {
    port: process.env.PORT || 5001,
    paddleOcrUrl: process.env.PADDLE_OCR_URL || 'http://localhost:9292/ocr/predict',
    ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434/api/generate',
    uploadDir: 'uploads',
    maxFileSize: 10 * 1024 * 1024, // 10MB
}; 