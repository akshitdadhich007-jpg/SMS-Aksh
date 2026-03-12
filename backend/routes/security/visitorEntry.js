/**
 * Security Visitor Entry Routes — Connected to: VisitorEntry.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { visitorEntrySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/visitors', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('visitor_logs').select('*').order('check_in', { ascending: false }).limit(50);
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/visitor/checkin', ...auth, validate(visitorEntrySchema), async (req, res, next) => {
    try {
        const { name, phone, flat, purpose, vehicle_number, photo_url } = req.body;
        const { data, error } = await supabaseAdmin.from('visitor_logs').insert({ visitor_name: name, phone, flat, purpose, vehicle_number, photo_url, logged_by: req.user.id }).select().single();
        if (error) throw error;
        return success(res, data, 'Visitor checked in', 201);
    } catch (err) { next(err); }
});

router.put('/visitor/checkout', ...auth, async (req, res, next) => {
    try {
        const { id } = req.body;
        const { data, error } = await supabaseAdmin.from('visitor_logs').update({ check_out: new Date(), status: 'checked-out' }).eq('id', id).select().single();
        if (error) throw error;
        return success(res, data, 'Visitor checked out');
    } catch (err) { next(err); }
});

module.exports = router;
