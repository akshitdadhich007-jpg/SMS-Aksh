/**
 * Admin Delivery Log Routes
 * ─────────────────────────
 * Connected to: DeliveryLog.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES, NOTIFICATION_TEMPLATES, interpolate } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { deliverySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/deliveries', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('deliveries')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.post('/deliveries', ...auth, validate(deliverySchema), async (req, res, next) => {
    try {
        const { flat, courier, date, type } = req.body;
        const { data, error } = await supabaseAdmin
            .from('deliveries')
            .insert({ flat, courier, date, type, logged_by: req.user.id })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Delivery logged', 201);
    } catch (err) {
        next(err);
    }
});

router.put('/deliveries/:id/notify', ...auth, async (req, res, next) => {
    try {
        const { data: delivery, error } = await supabaseAdmin
            .from('deliveries')
            .update({ status: 'notified' })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;

        const { data: resident } = await supabaseAdmin
            .from('residents')
            .select('profile_id')
            .eq('flat', delivery.flat)
            .single();

        if (resident?.profile_id) {
            const tmpl = NOTIFICATION_TEMPLATES.DELIVERY_ARRIVED;
            await createNotification(
                resident.profile_id,
                tmpl.title,
                interpolate(tmpl.body, { courier: delivery.courier || 'unknown courier' })
            );
        }

        return success(res, delivery, 'Resident notified');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
