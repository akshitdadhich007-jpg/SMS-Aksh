/**
 * Frontend Shared Constants
 * ─────────────────────────
 * Mirrors backend config/constants.js to keep status/role values in sync.
 * Import from here instead of using hardcoded strings.
 */

// ── Roles ──
export const ROLES = Object.freeze({
    ADMIN: 'admin',
    RESIDENT: 'resident',
    SECURITY: 'security',
});

// ── Role → Dashboard route mapping ──
export const ROLE_ROUTES = Object.freeze({
    [ROLES.ADMIN]: '/admin',
    [ROLES.RESIDENT]: '/resident',
    [ROLES.SECURITY]: '/security',
});

// ── Listing Status ──
export const LISTING_STATUS = Object.freeze({
    DRAFT: 'draft',
    PENDING: 'pending',
    ACTIVE: 'active',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SOLD: 'sold',
    RENTED: 'rented',
    WITHDRAWN: 'withdrawn',
    UNDER_VISIT: 'under_visit',
});

// ── Complaint Status ──
export const COMPLAINT_STATUS = Object.freeze({
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
});

// ── Bill Status ──
export const BILL_STATUS = Object.freeze({
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
});

// ── Claim Status (Traceback) ──
export const CLAIM_STATUS = Object.freeze({
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    INFO_REQUESTED: 'info_requested',
});

// ── Pre-Approval Status ──
export const PREAPPROVAL_STATUS = Object.freeze({
    ACTIVE: 'active',
    USED: 'used',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
});

// ── Visitor Status ──
export const VISITOR_STATUS = Object.freeze({
    ACTIVE: 'Active',
    CHECKED_OUT: 'checked-out',
});

// ── Fine Status ──
export const FINE_STATUS = Object.freeze({
    PENDING: 'Pending',
    PAID: 'Paid',
    UNPAID: 'unpaid',
});

// ── Violation Status ──
export const VIOLATION_STATUS = Object.freeze({
    PAID: 'Paid',
    UNPAID: 'Unpaid',
});

// ── Emergency Status ──
export const EMERGENCY_STATUS = Object.freeze({
    ACTIVE: 'active',
    RESOLVED: 'resolved',
});

// ── Demo Credentials (for development convenience) ──
export const DEMO_CREDENTIALS = [
    {
        email: 'admin@society.local',
        password: 'Admin@12345',
        name: 'Society Admin',
        role: ROLES.ADMIN,
        icon: '🧑‍💼',
    },
    {
        email: 'resident1@society.local',
        password: 'Resident@123',
        name: 'Raj Kumar',
        role: ROLES.RESIDENT,
        flat: 'A-101',
        icon: '🏠',
    },
    {
        email: 'security@society.local',
        password: 'Security@123',
        name: 'Ram Singh',
        role: ROLES.SECURITY,
        icon: '🛡️',
    },
];
