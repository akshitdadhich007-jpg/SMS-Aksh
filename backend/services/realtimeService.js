/**
 * Realtime Service
 * ────────────────
 * Connected to: EmergencyManagement.jsx, Traceback Claims, Marketplace Enquiries
 *
 * Channels:
 *   emergency_broadcast   → emergency alerts to all
 *   claim_updates:{userId} → claim status changes to specific user
 *   marketplace_enquiries → new enquiry notifications to listing owner
 *   notifications:{userId} → personal notifications
 */

const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Broadcasts a message to a Supabase Realtime channel.
 */
async function broadcast(channelName, eventName, payload) {
    try {
        const channel = supabaseAdmin.channel(channelName);
        await channel.send({
            type: 'broadcast',
            event: eventName,
            payload,
        });
    } catch (err) {
        logger.error(`Realtime broadcast error [${channelName}]`, { error: err.message });
    }
}

module.exports = { broadcast };
