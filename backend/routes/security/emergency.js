/**
 * Security Emergency Routes — Connected to: Emergency.jsx (Security)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { broadcast } = require('../../services/realtimeService');
const { ROLES, EMERGENCY_STATUS } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { emergencySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/emergency', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('emergency_alerts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/emergency', ...auth, validate(emergencySchema), async (req, res, next) => {
    try {
        const { type, message } = req.body;
        const { data, error } = await supabaseAdmin.from('emergency_alerts').insert({ type, message, reported_by: req.user.id }).select().single();
        if (error) throw error;
        await broadcast('emergency_broadcast', 'new_alert', data);
        return success(res, data, 'Emergency alert sent', 201);
    } catch (err) { next(err); }
});

router.put('/emergency/:id/resolve', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('emergency_alerts').update({ status: EMERGENCY_STATUS.RESOLVED, resolved_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        await broadcast('emergency_broadcast', 'alert_resolved', data);
        return success(res, data, 'Emergency resolved');
    } catch (err) { next(err); }
});

router.post('/emergency/drill', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('emergency_alerts').insert({ type: 'drill', message: 'Security drill initiated', reported_by: req.user.id }).select().single();
        if (error) throw error;
        await broadcast('emergency_broadcast', 'drill', data);
        return success(res, data, 'Drill initiated', 201);
    } catch (err) { next(err); }
});

module.exports = router;
