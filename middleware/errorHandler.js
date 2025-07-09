// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
}

module.exports = errorHandler; 