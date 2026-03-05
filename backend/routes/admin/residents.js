/**
 * Admin Resident Management Routes
 * ─────────────────────────────────
 * Connected to: ResidentManagement.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { residentSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

// GET /api/admin/residents
router.get('/residents', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('residents')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

// POST /api/admin/residents
router.post('/residents', ...auth, validate(residentSchema), async (req, res, next) => {
    try {
        const { name, flat, phone, email, status } = req.body;
        const { data, error } = await supabaseAdmin
            .from('residents')
            .insert({ name, flat, phone, email, status })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Resident added', 201);
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/residents/:id
router.put('/residents/:id', ...auth, validate(residentSchema), async (req, res, next) => {
    try {
        const { name, flat, phone, email, status } = req.body;
        const { data, error } = await supabaseAdmin
            .from('residents')
            .update({ name, flat, phone, email, status, updated_at: new Date() })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Resident updated');
    } catch (err) {
        next(err);
    }
});

// DELETE /api/admin/residents/:id
router.delete('/residents/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('residents')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Resident deleted');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
