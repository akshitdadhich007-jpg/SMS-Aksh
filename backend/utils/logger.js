const winston = require('winston');
const config = require('../config/env');

// Structured JSON logging for production, readable format for development
const logFormat = config.isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            ({ timestamp, level, message, ...meta }) => {
                return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            }
        )
    );

const transports = [new winston.transports.Console()];

// In production, also log to files
if (config.isProduction) {
    transports.push(
        new winston.transports.File({ filename: `${config.logDir}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${config.logDir}/combined.log` })
    );
}

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    defaultMeta: { service: 'sms-aksh-backend' },
    transports,
});

module.exports = logger;
