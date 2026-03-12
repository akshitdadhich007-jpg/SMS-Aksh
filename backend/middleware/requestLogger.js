/**
 * Request Logger Middleware
 * ────────────────────────
 * Logs incoming requests with method, URL, status code, and response time.
 * Skips health check to avoid log noise.
 * Adds a unique request ID (X-Request-Id) to every request and response.
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
    // Skip health check endpoints
    if (req.path === '/api/health') return next();

    // Attach unique request ID
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        };

        if (res.statusCode >= 400) {
            logger.warn('Request completed with error', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
}

module.exports = requestLogger;
