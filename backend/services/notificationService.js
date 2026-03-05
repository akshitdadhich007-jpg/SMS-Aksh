/**
 * Notification Service
 * ────────────────────
 * Connected to: NotificationPanel.jsx
 */

const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Inserts a notification row and broadcasts via Supabase Realtime.
 */
async function createNotification(userId, title, message) {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({ user_id: userId, title, message })
        .select()
        .single();

    if (error) {
        logger.error('Notification insert error', { error: error.message, userId, title });
        return null;
    }

    supabaseAdmin.channel(`notifications:${userId}`)
        .send({
            type: 'broadcast',
            event: 'new_notification',
            payload: data,
        });

    return data;
}

module.exports = { createNotification };
