/**
 * Admin Settings Routes
 * ─────────────────────
 * Connected to: AdminSettings.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { societySettingsSchema, maintenanceSettingsSchema, paymentSettingsSchema, lostFoundSettingsSchema, expenseCategorySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

// GET /api/admin/settings
router.get('/settings', ...auth, async (req, res, next) => {
    try {
        const [society, maintenance, payment, lostFound, notification, categories, adminUsers] =
            await Promise.all([
                supabaseAdmin.from('society_settings').select('*').limit(1).single(),
                supabaseAdmin.from('maintenance_settings').select('*').limit(1).single(),
                supabaseAdmin.from('payment_settings').select('*').limit(1).single(),
                supabaseAdmin.from('lost_found_settings').select('*').limit(1).single(),
                supabaseAdmin.from('notification_settings').select('*').limit(1).single(),
                supabaseAdmin.from('expense_categories').select('*').order('created_at'),
                supabaseAdmin.from('profiles').select('*').eq('role', ROLES.ADMIN),
            ]);

        return success(res, {
            societyProfile: society.data,
            maintenanceSettings: maintenance.data,
            paymentSettings: payment.data,
            lostFoundSettings: lostFound.data,
            notificationSettings: notification.data,
            expenseCategories: categories.data || [],
            adminUsers: adminUsers.data || [],
        });
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/settings/society
router.put('/settings/society', ...auth, validate(societySettingsSchema), async (req, res, next) => {
    try {
        const { name, address, registration_no, email, phone, total_flats, blocks } = req.body;
        const { data, error } = await supabaseAdmin
            .from('society_settings')
            .update({ name, address, registration_no, email, phone, total_flats, blocks, updated_at: new Date() })
            .eq('id', req.body.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Society settings updated');
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/settings/maintenance
router.put('/settings/maintenance', ...auth, validate(maintenanceSettingsSchema), async (req, res, next) => {
    try {
        const { monthly_amount, due_date, late_fee, auto_bill_generation } = req.body;
        const { data, error } = await supabaseAdmin
            .from('maintenance_settings')
            .update({ monthly_amount, due_date, late_fee, auto_bill_generation, updated_at: new Date() })
            .eq('id', req.body.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Maintenance settings updated');
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/settings/payment
router.put('/settings/payment', ...auth, validate(paymentSettingsSchema), async (req, res, next) => {
    try {
        const { enable_online_payments, upi, card, net_banking } = req.body;
        const { data, error } = await supabaseAdmin
            .from('payment_settings')
            .update({ enable_online_payments, upi, card, net_banking, updated_at: new Date() })
            .eq('id', req.body.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Payment settings updated');
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/settings/lostfound
router.put('/settings/lostfound', ...auth, validate(lostFoundSettingsSchema), async (req, res, next) => {
    try {
        const { enable_feature, require_approval, enable_disputes, pin_expiry } = req.body;
        const { data, error } = await supabaseAdmin
            .from('lost_found_settings')
            .update({ enable_feature, require_approval, enable_disputes, pin_expiry, updated_at: new Date() })
            .eq('id', req.body.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Lost & Found settings updated');
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/settings/notifications
router.put('/settings/notifications', ...auth, async (req, res, next) => {
    try {
        const fields = req.body;
        const { data, error } = await supabaseAdmin
            .from('notification_settings')
            .update({ ...fields, updated_at: new Date() })
            .eq('id', fields.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Notification settings updated');
    } catch (err) {
        next(err);
    }
});

// POST /api/admin/expense-category
router.post('/expense-category', ...auth, validate(expenseCategorySchema), async (req, res, next) => {
    try {
        const { name, budget } = req.body;
        const { data, error } = await supabaseAdmin
            .from('expense_categories')
            .insert({ name, budget })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Category created', 201);
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/expense-category/:id
router.put('/expense-category/:id', ...auth, validate(expenseCategorySchema), async (req, res, next) => {
    try {
        const { name, budget } = req.body;
        const { data, error } = await supabaseAdmin
            .from('expense_categories')
            .update({ name, budget })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Category updated');
    } catch (err) {
        next(err);
    }
});

// DELETE /api/admin/expense-category/:id
router.delete('/expense-category/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('expense_categories')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Category deleted');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
