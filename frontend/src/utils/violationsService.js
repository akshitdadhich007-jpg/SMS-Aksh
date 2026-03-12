/**
 * violationsService.js
 * Handles all violation CRUD operations via localStorage.
 * TODO: Firebase - replace localStorage operations with Firestore CRUD
 */

import { pushNotification } from './notificationStorage';

// ── Fine Rules ──────────────────────────────────────────────────────────────
export const FINE_RULES = {
    'Wrong Parking': 200,
    'Littering': 500,
    'Noise Complaint': 300,
    'Pet Violation': 250,
};

export const getFineAmount = (violationType) =>
    FINE_RULES[violationType] ?? 100;

// ── localStorage key (fallback) ─────────────────────────────────────────────
const LS_KEY = 'violations';

const lsGet = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
};
const lsSet = (data) => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('civiora-violations-updated'));
};

// ── Helpers ──────────────────────────────────────────────────────────────────

// ── Create violation & send notification ─────────────────────────────────────
export const createViolation = async ({
    resident_id,
    resident_name,
    violation_type,
    evidence_image = null,
    location = 'Society Premises',
}) => {
    const fine_amount = getFineAmount(violation_type);
    const created_at = new Date().toISOString();
    const status = 'Unpaid';

    const record = {
        resident_id,
        resident_name,
        violation_type,
        evidence_image,
        location,
        fine_amount,
        status,
        created_at,
    };

    let savedRecord = { ...record, id: `local-${Date.now()}` };

    // TODO: Firebase - write to Firestore violations collection
    const existing = lsGet();
    lsSet([savedRecord, ...existing]);

    // Push instant notification to the resident
    pushNotification({
        type: 'alert',
        title: `⚠️ Violation Detected: ${violation_type}`,
        message: `Fine: ₹${fine_amount}\nDate: ${new Date(created_at).toLocaleString('en-IN')}\nPlease pay the fine to avoid further action.`,
        recipient_id: resident_id,
        recipient_name: resident_name,
        created_at,
    });

    // Broadcast for cross-tab realtime (localStorage fallback path)
    window.dispatchEvent(new CustomEvent('civiora-violations-updated'));

    return savedRecord;
};

// ── Fetch all violations ──────────────────────────────────────────────────────
export const fetchAllViolations = async () => {
    // TODO: Firebase - query Firestore violations collection ordered by created_at desc
    return lsGet();
};

// ── Fetch violations for a specific resident ──────────────────────────────────
export const fetchViolationsForResident = async (resident_id) => {
    // TODO: Firebase - query Firestore violations where resident_id == resident_id
    return lsGet().filter(v => v.resident_id === resident_id);
};

// ── Pay a fine ────────────────────────────────────────────────────────────────
export const payViolationFine = async (violation_id) => {
    // TODO: Firebase - update Firestore violation document status to 'Paid'
    const existing = lsGet();
    const updated = existing.map(v =>
        String(v.id) === String(violation_id) ? { ...v, status: 'Paid' } : v
    );
    lsSet(updated);
    return updated.find(v => String(v.id) === String(violation_id));
};

// ── Delete violation (admin only) ─────────────────────────────────────────────
export const deleteViolation = async (violation_id) => {
    // TODO: Firebase - delete Firestore violation document
    const updated = lsGet().filter(v => String(v.id) !== String(violation_id));
    lsSet(updated);
    return true;
};

// ── Subscribe to realtime violations ─────────────────────────────────────────
export const subscribeToViolations = (callback) => {
    // TODO: Firebase - subscribe to Firestore violations collection with onSnapshot
    // localStorage event-based subscription (cross-tab)
    const handler = () => callback({ eventType: 'localStorage' });
    window.addEventListener('civiora-violations-updated', handler);
    return () => window.removeEventListener('civiora-violations-updated', handler);
};

// ── Aggregate stats ───────────────────────────────────────────────────────────
export const computeViolationStats = (violations = []) => ({
    total: violations.length,
    paid: violations.filter(v => v.status === 'Paid').length,
    unpaid: violations.filter(v => v.status === 'Unpaid').length,
    totalCollected: violations.filter(v => v.status === 'Paid').reduce((s, v) => s + (v.fine_amount || 0), 0),
    totalPending: violations.filter(v => v.status === 'Unpaid').reduce((s, v) => s + (v.fine_amount || 0), 0),
});
