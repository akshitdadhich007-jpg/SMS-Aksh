/**
 * Supabase Client Configuration (Singleton)
 * ──────────────────────────────────────────
 * Ensures clients are created exactly once and frozen.
 * Uses validated config from config/env.js.
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

let _client = null;
let _admin = null;

function getSupabaseClient() {
    if (!_client) {
        _client = createClient(config.supabaseUrl, config.supabaseAnonKey);
        Object.freeze(_client);
    }
    return _client;
}

function getSupabaseAdmin() {
    if (!_admin) {
        _admin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
        Object.freeze(_admin);
    }
    return _admin;
}

// Backwards-compatible exports
module.exports = {
    supabaseClient: getSupabaseClient(),
    supabaseAdmin: getSupabaseAdmin(),
    getSupabaseClient,
    getSupabaseAdmin,
};
