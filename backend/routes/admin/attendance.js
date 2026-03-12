/**
 * Admin Attendance Logs Routes — Connected to: AttendanceLogs.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/attendance', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('attendance_logs').select('*, staff(name, role)').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.delete('/attendance/clear', ...auth, async (req, res, next) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { error } = await supabaseAdmin.from('attendance_logs').delete().lt('date', thirtyDaysAgo.toISOString().split('T')[0]);
        if (error) throw error;
        return success(res, null, 'Old records cleared');
    } catch (err) { next(err); }
});

module.exports = router;
