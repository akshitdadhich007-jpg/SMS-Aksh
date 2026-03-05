/**
 * Auth Service
 * ────────────
 * Connected to: Login.jsx → fetch('/api/login')
 *
 * Demo users are fetched from the database (profiles with is_demo=true)
 * when DEMO_MODE=true, instead of being hardcoded.
 * JWT expiry read from config.
 */

const { supabaseAdmin } = require('../config/supabase');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { ERRORS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Authenticates user via demo credentials (if DEMO_MODE) or Supabase Auth.
 */
async function login(email, password) {
    // 1. Check demo users only if demo mode is enabled
    if (config.demoMode) {
        const demoResult = await tryDemoLogin(email, password);
        if (demoResult) return demoResult;
    }

    // 2. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth
        .signInWithPassword({ email, password });

    if (authError) {
        logger.warn(`Failed login attempt for ${email}: ${authError.message}`);
        throw new Error(ERRORS.AUTH.INVALID_CREDENTIALS);
    }

    const userId = authData.user.id;

    // 3. Fetch role from profiles table (DB-driven roles)
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role, name')
        .eq('id', userId)
        .single();

    if (profileError) throw new Error(ERRORS.AUTH.PROFILE_NOT_FOUND);

    // 4. Sign custom JWT
    const access_token = jwt.sign(
        { id: userId, email, role: profile.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    return {
        id: userId,
        email,
        role: profile.role,
        name: profile.name,
        access_token,
    };
}

/**
 * In-memory demo users (fallback when DB has no is_demo rows).
 * DB-driven demo users take priority when available.
 */
const IN_MEMORY_DEMO_USERS = [
    { id: 'demo-admin-001', email: 'admin@society.local', demo_password: 'Admin@12345', role: 'admin', name: 'Society Admin' },
    { id: 'demo-resident-001', email: 'resident1@society.local', demo_password: 'Resident@123', role: 'resident', name: 'Raj Kumar' },
    { id: 'demo-resident-002', email: 'resident2@society.local', demo_password: 'Resident@123', role: 'resident', name: 'Priya Singh' },
    { id: 'demo-security-001', email: 'security@society.local', demo_password: 'Security@123', role: 'security', name: 'Ram Singh' },
];

/**
 * Attempts demo login by querying 'profiles' table for demo users.
 * Demo users have is_demo=true and demo_password stored in the DB.
 * Falls back to in-memory demo users if DB has no demo rows.
 * Returns null if no matching demo user is found.
 */
async function tryDemoLogin(email, password) {
    // 1. Try DB-driven demo users first
    const { data: demoUser, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, role, name, demo_password')
        .eq('email', email.toLowerCase())
        .eq('is_demo', true)
        .single();

    let user = demoUser;

    // 2. Fallback to in-memory demo users if DB has no match
    if (error || !user) {
        user = IN_MEMORY_DEMO_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
    }

    if (!user) return null;

    // Validate demo password
    if (user.demo_password !== password) {
        throw new Error(ERRORS.AUTH.INVALID_CREDENTIALS);
    }

    const access_token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        access_token,
    };
}

module.exports = { login };
