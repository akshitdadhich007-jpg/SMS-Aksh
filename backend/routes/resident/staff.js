/**
 * Resident Staff View Routes — Connected to: Staff.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES, RESIDENT_STATUS } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/staff', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('staff').select('name, role, phone, shift, status').eq('status', RESIDENT_STATUS.ACTIVE);
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

module.exports = router;
