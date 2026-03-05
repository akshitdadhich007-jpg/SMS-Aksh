/**
 * Auth Controller
 * ───────────────
 * Connected to: Login.jsx → onSubmit: handleLogin
 */

const authService = require('../services/authService');
const { success, fail } = require('../utils/apiResponse');
const { ERRORS } = require('../config/constants');

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        // Joi validation middleware already ensures email and password exist and are valid types
        const result = await authService.login(email, password);
        return success(res, result, 'Login successful');
    } catch (err) {
        // Only return 401 for known auth failures, pass rest to global error handler
        if (err.message === ERRORS.AUTH.INVALID_CREDENTIALS || err.message === ERRORS.AUTH.PROFILE_NOT_FOUND) {
            return fail(res, err.message, 401);
        }
        err.statusCode = 401;
        next(err);
    }
}

module.exports = { login };
