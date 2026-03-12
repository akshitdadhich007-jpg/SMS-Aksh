/**
 * violationsService.js
 * Handles all violation CRUD operations.
 * Uses Supabase as primary store with localStorage as an offline fallback.
 */

import { supabase } from './supabaseClient';
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
const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return url && url !== 'https://placeholder.supabase.co';
};

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

    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('violations')
            .insert([record])
            .select()
            .single();

        if (!error && data) {
            savedRecord = data;
        } else {
            console.warn('Supabase insert failed, falling back to localStorage:', error?.message);
            const existing = lsGet();
            lsSet([savedRecord, ...existing]);
        }
    } else {
        const existing = lsGet();
        lsSet([savedRecord, ...existing]);
    }

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
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('violations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) return data;
        console.warn('Supabase fetch failed, using localStorage:', error?.message);
    }
    return lsGet();
};

// ── Fetch violations for a specific resident ──────────────────────────────────
export const fetchViolationsForResident = async (resident_id) => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('violations')
            .select('*')
            .eq('resident_id', resident_id)
            .order('created_at', { ascending: false });

        if (!error && data) return data;
        console.warn('Supabase fetch failed, using localStorage:', error?.message);
    }
    return lsGet().filter(v => v.resident_id === resident_id);
};

// ── Pay a fine ────────────────────────────────────────────────────────────────
export const payViolationFine = async (violation_id) => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('violations')
            .update({ status: 'Paid' })
            .eq('id', violation_id)
            .select()
            .single();

        if (!error && data) {
            window.dispatchEvent(new CustomEvent('civiora-violations-updated'));
            return data;
        }
        console.warn('Supabase update failed, falling back:', error?.message);
    }

    // localStorage fallback
    const existing = lsGet();
    const updated = existing.map(v =>
        String(v.id) === String(violation_id) ? { ...v, status: 'Paid' } : v
    );
    lsSet(updated);
    return updated.find(v => String(v.id) === String(violation_id));
};

// ── Delete violation (admin only) ─────────────────────────────────────────────
export const deleteViolation = async (violation_id) => {
    if (isSupabaseConfigured()) {
        const { error } = await supabase
            .from('violations')
            .delete()
            .eq('id', violation_id);

        if (!error) {
            window.dispatchEvent(new CustomEvent('civiora-violations-updated'));
            return true;
        }
        console.warn('Supabase delete failed, falling back:', error?.message);
    }

    const updated = lsGet().filter(v => String(v.id) !== String(violation_id));
    lsSet(updated);
    return true;
};

// ── Subscribe to realtime violations ─────────────────────────────────────────
export const subscribeToViolations = (callback) => {
    if (isSupabaseConfigured()) {
        const channel = supabase
            .channel('violations-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'violations' }, (payload) => {
                callback(payload);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }

    // localStorage polling fallback
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
