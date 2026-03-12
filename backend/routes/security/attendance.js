/**
 * Security Attendance Routes — Connected to: SecurityAttendance.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { attendanceSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/attendance', ...auth, async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabaseAdmin.from('attendance_logs').select('*, staff(name, role)').eq('date', today).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/attendance', ...auth, validate(attendanceSchema), async (req, res, next) => {
    try {
        const { staff_id, date, check_in, status, photo_url } = req.body;
        const { data, error } = await supabaseAdmin.from('attendance_logs').insert({ staff_id, date, check_in, status, photo_url, logged_by: req.user.id }).select().single();
        if (error) throw error;
        return success(res, data, 'Attendance recorded', 201);
    } catch (err) { next(err); }
});

router.put('/attendance/:id/checkout', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('attendance_logs').update({ check_out: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Check-out recorded');
    } catch (err) { next(err); }
});

module.exports = router;
