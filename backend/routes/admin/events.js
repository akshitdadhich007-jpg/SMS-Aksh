/**
 * Admin Events & Announcements Routes
 * ────────────────────────────────────
 * Connected to: EventsAnnouncements.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { eventSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/events', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.post('/events', ...auth, validate(eventSchema), async (req, res, next) => {
    try {
        const { type, title, message, date, time, location } = req.body;
        const { data, error } = await supabaseAdmin
            .from('events')
            .insert({ type, title, message, date, time, location })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Event created', 201);
    } catch (err) {
        next(err);
    }
});

router.delete('/events/clear', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('events')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
        return success(res, null, 'All events cleared');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
