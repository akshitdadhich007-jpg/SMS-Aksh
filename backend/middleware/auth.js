/**
 * Authentication & Authorization Middleware
 * ──────────────────────────────────────────
 * Connected to: components/features/Login.jsx
 *
 * authenticateJWT   → Validates Bearer token on every protected route
 * authorizeRole     → Restricts access to specific roles (uses ROLES constants)
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { ERRORS, ROLES } = require('../config/constants');

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Attaches decoded payload (id, email, role) to req.user.
 */
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: ERRORS.AUTH.TOKEN_MISSING,
            data: null,
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        // 401 means unauthenticated (invalid/expired token)
        return res.status(401).json({
            success: false,
            message: ERRORS.AUTH.TOKEN_INVALID,
            data: null,
        });
    }
}

/**
 * Factory function that returns middleware restricting access to one or more roles.
 * Usage: authorizeRole(ROLES.ADMIN), authorizeRole(ROLES.ADMIN, ROLES.RESIDENT)
 */
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS,
                data: null,
            });
        }
        next();
    };
}

module.exports = { authenticateJWT, authorizeRole };
