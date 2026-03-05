/**
 * Server Entry Point
 * ──────────────────
 * Loads env via config/env.js, starts Express.
 * Includes graceful shutdown and process-level error handling.
 */

const config = require('./config/env'); // validates env vars on require
const app = require('./app');
const logger = require('./utils/logger');

// Catch synchronous exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', { error: err.message, stack: err.stack });
    process.exit(1);
});

const server = app.listen(config.port, () => {
    logger.info(`✅ SMS-Aksh Backend running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

// Catch async promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', { error: err.message, stack: err.stack });
    server.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM (Docker, PM2)
process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => logger.info('💥 Process terminated!'));
});