/**
 * Admin Vehicle & Visitor Log Routes — Connected to: VehicleVisitorLog.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/vehicles', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('vehicle_logs').select('*').order('entry_time', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/visitor-logs', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('visitor_logs').select('*').order('check_in', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/vehicles/export', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('vehicle_logs').select('*').order('entry_time', { ascending: false });
        if (error) throw error;
        const csv = [
            'ID,Vehicle,Type,Owner,Flat,Entry,Exit,Status',
            ...data.map(v => `${v.id},${v.vehicle_number},${v.vehicle_type},${v.owner_name},${v.flat},${v.entry_time},${v.exit_time || ''},${v.status}`),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=vehicles_export.csv');
        res.send(csv);
    } catch (err) { next(err); }
});

module.exports = router;
