/**
 * Security Settings Routes — Connected to: SecuritySettings.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { profileUpdateSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/settings', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.put('/settings/profile', ...auth, validate(profileUpdateSchema), async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const { data, error } = await supabaseAdmin.from('profiles').update({ full_name: name, phone }).eq('id', req.user.id).select().single();
        if (error) throw error;
        return success(res, data, 'Profile updated');
    } catch (err) { next(err); }
});

module.exports = router;
