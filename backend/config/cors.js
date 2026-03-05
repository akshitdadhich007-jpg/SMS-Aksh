/**
 * CORS Configuration
 * ──────────────────
 * Environment-based CORS origins.
 * Development: allows localhost origins.
 * Production: restricts to CORS_ORIGIN env var.
 */

const config = require('./env');

const DEV_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
];

function getCorsOptions() {
    if (config.isProduction) {
        // In production, only allow explicitly configured origins
        const allowed = config.corsOrigin
            ? config.corsOrigin.split(',').map(o => o.trim()).filter(Boolean)
            : [];

        return {
            origin: (origin, callback) => {
                // Allow requests with no origin (server-to-server, mobile apps)
                if (!origin || allowed.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error(`CORS: Origin ${origin} not allowed`));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            maxAge: 86400, // 24h preflight cache
        };
    }

    // Development / staging: permissive
    return {
        origin: DEV_ORIGINS,
        credentials: true,
    };
}

module.exports = { getCorsOptions };
