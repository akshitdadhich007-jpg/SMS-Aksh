/**
 * Application Constants
 * ─────────────────────
 * Centralized enums, status values, error messages, and notification templates.
 * All hardcoded string literals from routes are consolidated here.
 *
 * To make these DB-driven in the future, replace the exports with
 * a service that fetches from a `app_constants` or `notification_templates` table.
 */

// ── Role Enums ──────────────────────────────────────────
const ROLES = Object.freeze({
    ADMIN: 'admin',
    RESIDENT: 'resident',
    SECURITY: 'security',
});

const ALL_ROLES = Object.freeze(Object.values(ROLES));

// ── Status Enums ────────────────────────────────────────
const COMPLAINT_STATUS = Object.freeze({
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
});

const BILL_STATUS = Object.freeze({
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
});

const LISTING_STATUS = Object.freeze({
    PENDING: 'pending',
    ACTIVE: 'active',
    SOLD: 'sold',
    RENTED: 'rented',
    REJECTED: 'rejected',
});

const CLAIM_STATUS = Object.freeze({
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    INFO_REQUESTED: 'info_requested',
});

const ITEM_STATUS = Object.freeze({
    OPEN: 'open',
    MATCHED: 'matched',
    CLAIMED: 'claimed',
    CLOSED: 'closed',
    REPORTED: 'reported',
});

const EMERGENCY_STATUS = Object.freeze({
    ACTIVE: 'active',
    RESOLVED: 'resolved',
});

const RESIDENT_STATUS = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
});

const DELIVERY_STATUS = Object.freeze({
    PENDING: 'pending',
    DELIVERED: 'delivered',
    RETURNED: 'returned',
});

const VEHICLE_LOG_STATUS = Object.freeze({
    IN: 'in',
    OUT: 'out',
});

const PREAPPROVAL_STATUS = Object.freeze({
    ACTIVE: 'active',
    USED: 'used',
    EXPIRED: 'expired',
});

// ── Error Messages ──────────────────────────────────────
const ERRORS = Object.freeze({
    AUTH: {
        TOKEN_MISSING: 'Access token missing or malformed',
        TOKEN_INVALID: 'Invalid or expired token',
        INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
        INVALID_CREDENTIALS: 'Invalid email or password',
        PROFILE_NOT_FOUND: 'Profile not found',
    },
    VALIDATION: {
        FAILED: 'Validation Error',
    },
    GENERAL: {
        INTERNAL: 'Internal Server Error. Please contact support.',
        NOT_FOUND: 'Resource not found',
        TOO_MANY_REQUESTS: 'Too many requests, please try again later',
        TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts, please try again later',
    },
    STORAGE: {
        UPLOAD_FAILED: 'Storage upload failed',
        DELETE_FAILED: 'Storage delete failed',
    },
    RESIDENT: {
        NOT_FOUND: 'Resident profile not found',
    },
});

// ── Notification Templates ──────────────────────────────
// Use {variable} placeholders for dynamic values
const NOTIFICATION_TEMPLATES = Object.freeze({
    BILL_GENERATED: {
        title: 'New Bill Generated',
        body: 'Your maintenance bill of ₹{amount} for {month} is due by {dueDate}.',
    },
    COMPLAINT_STATUS_UPDATED: {
        title: 'Complaint Status Updated',
        body: 'Your complaint "{title}" has been updated to: {status}',
    },
    LISTING_APPROVED: {
        title: 'Listing Approved',
        body: 'Your listing "{title}" has been approved and is now live.',
    },
    LISTING_REJECTED: {
        title: 'Listing Rejected',
        body: 'Your listing "{title}" was rejected. Please contact admin for details.',
    },
    CLAIM_APPROVED: {
        title: 'Claim Update',
        body: 'Your ownership claim has been approved! Please collect your item.',
    },
    CLAIM_REJECTED: {
        title: 'Claim Update',
        body: 'Your ownership claim was rejected. Reason: {reason}',
    },
    CLAIM_INFO_REQUESTED: {
        title: 'Claim Update',
        body: 'Admin has requested additional information for your ownership claim.',
    },
    VISITOR_PRE_APPROVED: {
        title: 'Visitor Pre-Approved',
        body: 'Your visitor {visitorName} has been pre-approved with code {code}.',
    },
    EMERGENCY_ALERT: {
        title: 'Emergency Alert',
        body: '{type}: {message}',
    },
    DELIVERY_ARRIVED: {
        title: 'Delivery Arrived',
        body: 'A delivery from {courier} has arrived at the gate.',
    },
});

/**
 * Interpolates template strings with provided values.
 * @param {string} template - Template with {variable} placeholders
 * @param {Object} values - Key-value pairs to replace
 * @returns {string}
 *
 * @example
 * interpolate('Hello {name}, your bill is ₹{amount}', { name: 'Raj', amount: 2500 })
 * // → 'Hello Raj, your bill is ₹2500'
 */
function interpolate(template, values = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return values[key] !== undefined ? String(values[key]) : `{${key}}`;
    });
}

module.exports = {
    ROLES,
    ALL_ROLES,
    COMPLAINT_STATUS,
    BILL_STATUS,
    LISTING_STATUS,
    CLAIM_STATUS,
    ITEM_STATUS,
    EMERGENCY_STATUS,
    RESIDENT_STATUS,
    DELIVERY_STATUS,
    VEHICLE_LOG_STATUS,
    PREAPPROVAL_STATUS,
    ERRORS,
    NOTIFICATION_TEMPLATES,
    interpolate,
};
