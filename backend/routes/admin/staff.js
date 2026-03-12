/**
 * Admin Staff Management Routes
 * ─────────────────────────────
 * Connected to: StaffManagement.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { staffSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/staff', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.post('/staff', ...auth, validate(staffSchema), async (req, res, next) => {
    try {
        const { name, role, phone, salary, shift } = req.body;
        const { data, error } = await supabaseAdmin
            .from('staff')
            .insert({ name, role, phone, salary, shift })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Staff member added', 201);
    } catch (err) {
        next(err);
    }
});

router.put('/staff/:id', ...auth, validate(staffSchema), async (req, res, next) => {
    try {
        const { name, role, phone, salary, shift, status } = req.body;
        const { data, error } = await supabaseAdmin
            .from('staff')
            .update({ name, role, phone, salary, shift, status })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Staff member updated');
    } catch (err) {
        next(err);
    }
});

router.delete('/staff/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('staff')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Staff member deleted');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
