/**
 * Resident Vehicles Routes — Connected to: Vehicles.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/vehicles', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('flat').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('vehicle_logs').select('*').eq('flat', resident.flat).order('entry_time', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

module.exports = router;
