/**
 * Resident Announcements Routes — Connected to: Announcements.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/announcements', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('events').select('*').eq('type', 'announcement').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

module.exports = router;
