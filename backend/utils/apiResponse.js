/**
 * Standardized API Response Helpers
 * ──────────────────────────────────
 * Ensures every endpoint returns: { success, message, data }
 */

function success(res, data = null, message = 'OK', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

function created(res, data = null, message = 'Created successfully') {
    return success(res, data, message, 201);
}

function fail(res, message = 'Bad Request', statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

module.exports = { success, created, fail };
