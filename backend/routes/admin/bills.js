/**
 * Admin Bill Management Routes
 * ────────────────────────────
 * Connected to: BillManagement.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES, NOTIFICATION_TEMPLATES, interpolate } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { billSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

// GET /api/admin/bills
router.get('/bills', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('bills')
            .select('*, residents(name, flat)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/bills/:id
router.get('/bills/:id', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('bills')
            .select('*, residents(name, flat, email)')
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

// POST /api/admin/bills
router.post('/bills', ...auth, validate(billSchema), async (req, res, next) => {
    try {
        const { resident_id, month, total_amount, due_date } = req.body;

        const { data: bill, error } = await supabaseAdmin
            .from('bills')
            .insert({ resident_id, month, total_amount, due_date })
            .select('*, residents(name, flat, profile_id)')
            .single();
        if (error) throw error;

        if (bill.residents?.profile_id) {
            const tmpl = NOTIFICATION_TEMPLATES.BILL_GENERATED;
            await createNotification(
                bill.residents.profile_id,
                tmpl.title,
                interpolate(tmpl.body, { amount: total_amount, month, dueDate: due_date })
            );
        }

        return success(res, bill, 'Bill generated', 201);
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/export/bills
router.get('/export/bills', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('bills')
            .select('*, residents(name, flat)')
            .order('created_at', { ascending: false });
        if (error) throw error;

        const csv = [
            'ID,Resident,Flat,Month,Amount,Status,Created',
            ...data.map(b =>
                `${b.id},${b.residents?.name},${b.residents?.flat},${b.month},${b.total_amount},${b.status},${b.created_at}`
            ),
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bills_export.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
