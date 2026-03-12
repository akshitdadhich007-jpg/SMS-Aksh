/**
 * Resident Emergency Routes — Connected to: Emergency.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { broadcast } = require('../../services/realtimeService');
const { createNotification } = require('../../services/notificationService');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { emergencySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.post('/emergency', ...auth, validate(emergencySchema), async (req, res, next) => {
    try {
        const { type, message } = req.body;
        const { data, error } = await supabaseAdmin.from('emergency_alerts').insert({ type: type || 'resident_alert', message, reported_by: req.user.id }).select().single();
        if (error) throw error;
        await broadcast('emergency_broadcast', 'new_alert', data);
        const { data: responders } = await supabaseAdmin.from('profiles').select('id').in('role', [ROLES.ADMIN, ROLES.SECURITY]);
        for (const r of (responders || [])) {
            await createNotification(r.id, '🚨 Emergency Alert', message || 'A resident has triggered an emergency alert!');
        }
        return success(res, data, 'Emergency alert sent', 201);
    } catch (err) { next(err); }
});

module.exports = router;
