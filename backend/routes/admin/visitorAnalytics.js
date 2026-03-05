/**
 * Admin Visitor Analytics Routes — Connected to: VisitorAnalytics.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/visitor-analytics', ...auth, async (req, res, next) => {
    try {
        const range = req.query.range || 'week';
        let since = new Date();
        if (range === 'week') since.setDate(since.getDate() - 7);
        else if (range === 'month') since.setMonth(since.getMonth() - 1);
        else if (range === 'year') since.setFullYear(since.getFullYear() - 1);

        const { data: visitors, error: ve } = await supabaseAdmin.from('visitor_logs').select('*').gte('check_in', since.toISOString());
        const { data: vehicles, error: vhe } = await supabaseAdmin.from('vehicle_logs').select('*').gte('entry_time', since.toISOString());
        if (ve) throw ve;
        if (vhe) throw vhe;

        const dailyVisitors = {};
        const dailyVehicles = {};
        visitors?.forEach(v => { const day = new Date(v.check_in).toISOString().split('T')[0]; dailyVisitors[day] = (dailyVisitors[day] || 0) + 1; });
        vehicles?.forEach(v => { const day = new Date(v.entry_time).toISOString().split('T')[0]; dailyVehicles[day] = (dailyVehicles[day] || 0) + 1; });

        return success(res, { totalVisitors: visitors?.length || 0, totalVehicles: vehicles?.length || 0, dailyVisitors, dailyVehicles });
    } catch (err) { next(err); }
});

module.exports = router;
