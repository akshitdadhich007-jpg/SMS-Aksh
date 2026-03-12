/**
 * Admin Payment Records Routes — Connected to: PaymentRecords.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/payments', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('payments').select('*, residents(name, flat), bills(month)').order('paid_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/payments/ledger', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('payments').select('*, residents(name, flat), bills(month)').order('paid_at', { ascending: false });
        if (error) throw error;
        const csv = [
            'ID,Resident,Flat,Month,Amount,Method,Status,Date',
            ...data.map(p => `${p.id},${p.residents?.name},${p.residents?.flat},${p.bills?.month},${p.amount},${p.method},${p.status},${p.paid_at}`),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=payment_ledger.csv');
        res.send(csv);
    } catch (err) { next(err); }
});

module.exports = router;
