/**
 * Security Dashboard Routes — Connected to: SecurityDashboard.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES, PREAPPROVAL_STATUS } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/dashboard', ...auth, async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [visitors, vehicles, preapproved, deliveries, emergencies] = await Promise.all([
            supabaseAdmin.from('visitor_logs').select('*').gte('check_in', `${today}T00:00:00`).order('check_in', { ascending: false }),
            supabaseAdmin.from('vehicle_logs').select('*').gte('entry_time', `${today}T00:00:00`).order('entry_time', { ascending: false }),
            supabaseAdmin.from('visitor_preapprovals').select('*').eq('status', PREAPPROVAL_STATUS.ACTIVE).gte('date_of_visit', today),
            supabaseAdmin.from('deliveries').select('*').gte('created_at', `${today}T00:00:00`),
            supabaseAdmin.from('emergency_alerts').select('*').eq('status', 'active'),
        ]);
        return success(res, {
            todayVisitors: visitors.data || [], todayVehicles: vehicles.data || [],
            pendingPreApprovals: preapproved.data || [], todayDeliveries: deliveries.data || [],
            activeEmergencies: emergencies.data || [],
        });
    } catch (err) { next(err); }
});

module.exports = router;
