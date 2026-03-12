/**
 * Admin Expense Tracker Routes
 * ────────────────────────────
 * Connected to: ExpenseTracker.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { expenseSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/expenses', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('expenses')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.post('/expenses', ...auth, validate(expenseSchema), async (req, res, next) => {
    try {
        const { category, description, amount, date, vendor } = req.body;
        const { data, error } = await supabaseAdmin
            .from('expenses')
            .insert({ category, description, amount, date, vendor })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Expense added', 201);
    } catch (err) {
        next(err);
    }
});

router.put('/expenses/:id', ...auth, validate(expenseSchema), async (req, res, next) => {
    try {
        const { category, description, amount, date, vendor } = req.body;
        const { data, error } = await supabaseAdmin
            .from('expenses')
            .update({ category, description, amount, date, vendor })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Expense updated');
    } catch (err) {
        next(err);
    }
});

router.delete('/expenses/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('expenses')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Expense deleted');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
