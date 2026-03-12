/**
 * Admin Dashboard Routes
 * ──────────────────────
 * Connected to: AdminDashboard.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

// GET /api/admin/reports/summary
router.get('/reports/summary', ...auth, async (req, res, next) => {
    try {
        const [
            { count: totalResidents },
            { count: totalComplaints },
            { data: pendingComplaints },
            { data: allPayments },
            { data: monthlyPayments },
        ] = await Promise.all([
            supabaseAdmin.from('residents').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('complaints').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('complaints').select('id').eq('status', 'open'),
            supabaseAdmin.from('payments').select('amount'),
            supabaseAdmin.from('payments').select('amount, paid_at').order('paid_at', { ascending: true }),
        ]);

        const totalRevenue = allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        const monthlyBreakdown = {};
        (monthlyPayments || []).forEach(p => {
            const month = new Date(p.paid_at).toISOString().slice(0, 7);
            monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + Number(p.amount);
        });

        return success(res, {
            totalResidents: totalResidents || 0,
            totalComplaints: totalComplaints || 0,
            pendingComplaints: pendingComplaints?.length || 0,
            totalRevenue,
            monthlyBreakdown,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
