/**
 * Resident Document Access Routes — Connected to: Documents.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/documents', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('documents').select('id, name, type, size, file_url, created_at').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

module.exports = router;
