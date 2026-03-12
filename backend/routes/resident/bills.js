/**
 * Resident Bills & Payment Routes — Connected to: MyBills.jsx, PayMaintenance.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES, BILL_STATUS } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');
const { paymentSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/bills', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('bills').select('*').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/bills/:id/invoice', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('bills').select('*, residents(name, flat)').eq('id', req.params.id).single();
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/pay/:billId', ...auth, validate(paymentSchema), async (req, res, next) => {
    try {
        const { method } = req.body;
        const { data: resident } = await supabaseAdmin.from('residents').select('id, profile_id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);

        const { data: bill } = await supabaseAdmin.from('bills').select('*').eq('id', req.params.billId).single();
        if (!bill) return fail(res, 'Bill not found', 404);

        const { data: payment, error: payError } = await supabaseAdmin.from('payments').insert({
            bill_id: bill.id, resident_id: resident.id, amount: bill.total_amount,
            method: method || 'upi', transaction_id: `TXN-${Date.now()}`,
        }).select().single();
        if (payError) throw payError;

        await supabaseAdmin.from('bills').update({ status: BILL_STATUS.PAID }).eq('id', bill.id);

        const { data: admins } = await supabaseAdmin.from('profiles').select('id').eq('role', ROLES.ADMIN);
        for (const admin of (admins || [])) {
            await createNotification(admin.id, 'Payment Received', `Resident ${resident.id} paid ₹${bill.total_amount} for ${bill.month}.`);
        }

        return success(res, { payment, billStatus: BILL_STATUS.PAID });
    } catch (err) { next(err); }
});

module.exports = router;
