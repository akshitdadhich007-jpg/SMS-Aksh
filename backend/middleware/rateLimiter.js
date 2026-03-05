const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const { ERRORS } = require('../config/constants');

// General API Rate Limiter
const apiLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: ERRORS.GENERAL.TOO_MANY_REQUESTS, data: null },
});

// Auth Rate Limiter (strict)
const authLimiter = rateLimit({
    windowMs: config.authRateLimitWindowMs,
    max: config.authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: ERRORS.GENERAL.TOO_MANY_LOGIN_ATTEMPTS, data: null },
});

module.exports = { apiLimiter, authLimiter };
