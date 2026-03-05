const logger = require('../utils/logger');
const config = require('../config/env');
const { ERRORS } = require('../config/constants');

/**
 * Global Error Handler
 * ────────────────────
 * Ensures deep crash details are NOT leaked to consumers in production.
 * Uses standardized { success, message, data } response format.
 * Includes request ID for tracing.
 */
const errorHandler = (err, req, res, _next) => {
    logger.error(`Error processing ${req.method} ${req.url}`, {
        requestId: req.requestId || 'unknown',
        errorMsg: err.message,
        stack: err.stack,
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user ? req.user.id : 'unauthenticated',
    });

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: config.isProduction && statusCode === 500
            ? ERRORS.GENERAL.INTERNAL
            : err.message || ERRORS.GENERAL.INTERNAL,
        data: null,
    });
};

module.exports = errorHandler;
