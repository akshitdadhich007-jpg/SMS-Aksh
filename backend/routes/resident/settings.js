/**
 * Resident Settings Routes — Connected to: ResidentSettings.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { profileUpdateSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/settings/profile', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.put('/settings/profile', ...auth, validate(profileUpdateSchema), async (req, res, next) => {
    try {
        const { name, phone, avatar_url } = req.body;
        const { data, error } = await supabaseAdmin.from('profiles').update({ full_name: name, phone, avatar_url }).eq('id', req.user.id).select().single();
        if (error) throw error;
        return success(res, data, 'Profile updated');
    } catch (err) { next(err); }
});

router.post('/settings/password', ...auth, async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const { error } = await supabaseAdmin.auth.admin.updateUserById(req.user.id, { password: newPassword });
        if (error) throw error;
        return success(res, null, 'Password changed');
    } catch (err) { next(err); }
});

module.exports = router;
