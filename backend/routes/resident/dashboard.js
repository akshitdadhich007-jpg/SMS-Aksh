/**
 * Resident Dashboard Routes — Connected to: ResidentDashboard.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES, COMPLAINT_STATUS, BILL_STATUS } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/dashboard', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);

        const [bills, complaints, events, maintenance] = await Promise.all([
            supabaseAdmin.from('bills').select('id, total_amount, status, month, due_date').eq('resident_id', resident.id).eq('status', BILL_STATUS.PENDING).order('created_at', { ascending: false }),
            supabaseAdmin.from('complaints').select('id, title, status, created_at').eq('resident_id', resident.id).eq('status', COMPLAINT_STATUS.OPEN).order('created_at', { ascending: false }),
            supabaseAdmin.from('events').select('*').order('created_at', { ascending: false }).limit(5),
            supabaseAdmin.from('bills').select('total_amount, status, month').eq('resident_id', resident.id).order('created_at', { ascending: false }).limit(12),
        ]);

        return success(res, {
            pendingBills: bills.data || [],
            openComplaints: complaints.data || [],
            recentEvents: events.data || [],
            maintenanceHistory: maintenance.data || [],
        });
    } catch (err) { next(err); }
});

module.exports = router;
