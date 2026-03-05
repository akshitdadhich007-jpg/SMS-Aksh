/**
 * Environment Configuration
 * ─────────────────────────
 * Validates all required env vars on startup.
 * Crashes early with a clear message if anything is missing.
 */

require('dotenv').config();

const REQUIRED_VARS = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
];

const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
    console.error(`❌ FATAL: Missing required environment variables:\n   ${missing.join(', ')}\n   Please check your .env file.`);
    process.exit(1);
}

const config = Object.freeze({
    // Server
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // Supabase
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
    authRateLimitWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 60 * 60 * 1000,
    authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,

    // Storage Buckets
    storageBucketSurveillance: process.env.STORAGE_BUCKET_SURVEILLANCE || 'surveillance-images',
    storageBucketLostFound: process.env.STORAGE_BUCKET_LOST_FOUND || 'lost-found-images',
    storageBucketProofs: process.env.STORAGE_BUCKET_PROOFS || 'proof-uploads',

    // Matching Engine
    matchScoreCategory: parseInt(process.env.MATCH_SCORE_CATEGORY, 10) || 40,
    matchScoreColor: parseInt(process.env.MATCH_SCORE_COLOR, 10) || 30,
    matchScoreDatePenalty: parseInt(process.env.MATCH_SCORE_DATE_PENALTY, 10) || 5,

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || '',

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || 'logs',

    // Approval Code Generator
    approvalCodeLength: parseInt(process.env.APPROVAL_CODE_LENGTH, 10) || 6,
    approvalCodeChars: process.env.APPROVAL_CODE_CHARS || 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',

    // Demo mode (enables demo user login bypass via DB-flagged users)
    demoMode: process.env.DEMO_MODE === 'true',
});

module.exports = config;
