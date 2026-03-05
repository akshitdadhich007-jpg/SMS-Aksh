/**
 * Resident Fines Routes — Connected to: MyFines.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/fines', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('fines').select('*').eq('resident_id', resident.id).order('issued_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/fines/:id/pay', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('fines').update({ status: 'paid', paid_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Fine paid');
    } catch (err) { next(err); }
});

module.exports = router;
