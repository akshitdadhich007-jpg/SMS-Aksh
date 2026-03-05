/**
 * Security Pre-Approved Visitors Routes — Connected to: PreApprovedVisitors.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES, PREAPPROVAL_STATUS } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/preapproved', ...auth, async (req, res, next) => {
    try {
        let query;
        if (req.query.code) {
            query = supabaseAdmin.from('visitor_preapprovals').select('*, residents(name, flat)').eq('approval_code', req.query.code.toUpperCase());
        } else {
            query = supabaseAdmin.from('visitor_preapprovals').select('*, residents(name, flat)').in('status', [PREAPPROVAL_STATUS.ACTIVE, PREAPPROVAL_STATUS.USED]).order('date_of_visit', { ascending: true });
        }
        const { data, error } = await query;
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/mark-entry/:id', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('visitor_preapprovals').update({ status: PREAPPROVAL_STATUS.USED, entry_time: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        await supabaseAdmin.from('visitor_logs').insert({ visitor_name: data.visitor_name, phone: data.mobile_number, flat: '', purpose: data.purpose, vehicle_number: data.vehicle_number, logged_by: req.user.id });
        return success(res, data, 'Entry marked');
    } catch (err) { next(err); }
});

router.post('/mark-exit/:id', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('visitor_preapprovals').update({ exit_time: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Exit marked');
    } catch (err) { next(err); }
});

module.exports = router;
