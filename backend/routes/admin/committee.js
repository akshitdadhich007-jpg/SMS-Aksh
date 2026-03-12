/**
 * Admin Committee Management Routes
 * ──────────────────────────────────
 * Connected to: CommitteeManagement.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { committeeRoleSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/committee', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('committee_members')
            .select('*, residents(name, flat)')
            .order('created_at');
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.get('/committee/:id', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('committee_members')
            .select('*, residents(name, flat, email, phone)')
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.put('/committee/:id/role', ...auth, validate(committeeRoleSchema), async (req, res, next) => {
    try {
        const { position } = req.body;
        const { data, error } = await supabaseAdmin
            .from('committee_members')
            .update({ position })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Committee role updated');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
