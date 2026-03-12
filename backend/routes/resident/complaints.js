/**
 * Resident Complaints Routes — Connected to: Complaints.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');
const { complaintSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/complaints', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('complaints').select('*').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/complaints', ...auth, validate(complaintSchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { title, description } = req.body;
        const { data, error } = await supabaseAdmin.from('complaints').insert({ resident_id: resident.id, title, description }).select().single();
        if (error) throw error;
        return success(res, data, 'Complaint submitted', 201);
    } catch (err) { next(err); }
});

module.exports = router;
