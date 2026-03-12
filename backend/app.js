/**
 * Express Application Setup
 * ─────────────────────────
 * Registers all route modules mapped to frontend portals.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getCorsOptions } = require('./config/cors');
const { apiLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { ROLES } = require('./config/constants');

const app = express();

// ── Global Middleware ──
app.use(helmet()); // Sets robust HTTP security headers
app.use(cors(getCorsOptions())); // Environment-based CORS
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger); // Structured request/response logging with request IDs
app.use('/api', apiLimiter); // Apply rate limiting to all API routes to prevent DoS

// ── Route Registration ──
// Auth (Login.jsx)
app.use('/api', require('./routes/auth'));

// Admin Portal
app.use('/api/admin', require('./routes/admin/dashboard'));
app.use('/api/admin', require('./routes/admin/settings'));
app.use('/api/admin', require('./routes/admin/bills'));
app.use('/api/admin', require('./routes/admin/complaints'));
app.use('/api/admin', require('./routes/admin/residents'));
app.use('/api/admin', require('./routes/admin/staff'));
app.use('/api/admin', require('./routes/admin/committee'));
app.use('/api/admin', require('./routes/admin/expenses'));
app.use('/api/admin', require('./routes/admin/events'));
app.use('/api/admin', require('./routes/admin/documents'));
app.use('/api/admin', require('./routes/admin/deliveries'));
app.use('/api/admin', require('./routes/admin/vehicles'));
app.use('/api/admin', require('./routes/admin/assetBooking'));
app.use('/api/admin', require('./routes/admin/emergency'));
app.use('/api/admin', require('./routes/admin/surveillance'));
app.use('/api/admin', require('./routes/admin/attendance'));
app.use('/api/admin', require('./routes/admin/visitorAnalytics'));
app.use('/api/admin', require('./routes/admin/paymentRecords'));
app.use('/api/admin', require('./routes/admin/reports'));
app.use('/api/admin', require('./routes/admin/marketplace'));

// Traceback (Lost & Found) — shared across portals
app.use('/api/traceback', require('./routes/traceback'));

// Resident Portal
app.use('/api/resident', require('./routes/resident/dashboard'));
app.use('/api/resident', require('./routes/resident/bills'));
app.use('/api/resident', require('./routes/resident/complaints'));
app.use('/api/resident', require('./routes/resident/visitorPreApproval'));
app.use('/api/resident', require('./routes/resident/assetBooking'));
app.use('/api/resident', require('./routes/resident/documents'));
app.use('/api/resident', require('./routes/resident/emergency'));
app.use('/api/resident', require('./routes/resident/settings'));
app.use('/api/resident', require('./routes/resident/fines'));
app.use('/api/resident', require('./routes/resident/marketplace'));
app.use('/api/resident', require('./routes/resident/staff'));
app.use('/api/resident', require('./routes/resident/vehicles'));
app.use('/api/resident', require('./routes/resident/announcements'));
app.use('/api/resident', require('./routes/resident/paymentHistory'));

// Security Portal
app.use('/api/security', require('./routes/security/dashboard'));
app.use('/api/security', require('./routes/security/visitorEntry'));
app.use('/api/security', require('./routes/security/vehicleEntry'));
app.use('/api/security', require('./routes/security/deliveries'));
app.use('/api/security', require('./routes/security/preApproved'));
app.use('/api/security', require('./routes/security/attendance'));
app.use('/api/security', require('./routes/security/emergency'));
app.use('/api/security', require('./routes/security/settings'));

// Notifications
app.use('/api', require('./routes/notifications'));

// ── Health Check ──
app.get('/api/health', (req, res) => res.json({ success: true, message: 'OK', data: { timestamp: new Date().toISOString() } }));

// ── Global Error Handler (Must be registered last) ──
app.use(errorHandler);

module.exports = app;
