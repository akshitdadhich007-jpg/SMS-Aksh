/**
 * Notifications Routes — Connected to: NotificationsPanel.jsx
 */
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const { success } = require('../utils/apiResponse');

// GET /api/notifications
router.get('/notifications', authenticateJWT, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

// PUT /api/notifications/:id/read
router.put('/notifications/:id/read', authenticateJWT, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Notification marked as read');
    } catch (err) { next(err); }
});

// PUT /api/notifications/read-all
router.put('/notifications/read-all', authenticateJWT, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', req.user.id)
            .eq('is_read', false);
        if (error) throw error;
        return success(res, null, 'All notifications marked as read');
    } catch (err) { next(err); }
});

// DELETE /api/notifications/:id
router.delete('/notifications/:id', authenticateJWT, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);
        if (error) throw error;
        return success(res, null, 'Notification deleted');
    } catch (err) { next(err); }
});

// DELETE /api/notifications
router.delete('/notifications', authenticateJWT, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('user_id', req.user.id);
        if (error) throw error;
        return success(res, null, 'All notifications cleared');
    } catch (err) { next(err); }
});

module.exports = router;
