/**
 * Resident Visitor Pre-Approval Routes — Connected to: VisitorPreApproval.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { generateApprovalCode } = require('../../utils/codeGenerator');
const { ROLES } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');
const { visitorPreApprovalSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/visitor-preapproval', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('visitor_preapprovals').select('*').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/visitor-preapproval', ...auth, validate(visitorPreApprovalSchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);

        const { visitorName, mobileNumber, purpose, dateOfVisit, startTime, endTime, vehicleNumber } = req.body;

        let approval_code, isUnique = false;
        while (!isUnique) {
            approval_code = generateApprovalCode();
            const { data: existing } = await supabaseAdmin.from('visitor_preapprovals').select('id').eq('approval_code', approval_code);
            if (!existing?.length) isUnique = true;
        }

        const { data, error } = await supabaseAdmin.from('visitor_preapprovals').insert({
            resident_id: resident.id, visitor_name: visitorName, mobile_number: mobileNumber,
            purpose, date_of_visit: dateOfVisit, start_time: startTime, end_time: endTime,
            vehicle_number: vehicleNumber, approval_code,
        }).select().single();
        if (error) throw error;
        return success(res, data, 'Visitor pre-approved', 201);
    } catch (err) { next(err); }
});

router.delete('/visitor-preapproval/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('visitor_preapprovals').update({ status: 'cancelled' }).eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Approval cancelled');
    } catch (err) { next(err); }
});

module.exports = router;
