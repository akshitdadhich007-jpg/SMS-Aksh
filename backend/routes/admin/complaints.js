/**
 * Admin Complaint Management Routes
 * ──────────────────────────────────
 * Connected to: ComplaintManagement.jsx
 */

const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES, NOTIFICATION_TEMPLATES, interpolate } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { complaintStatusSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

// GET /api/admin/complaints
router.get('/complaints', ...auth, async (req, res, next) => {
    try {
        let query = supabaseAdmin
            .from('complaints')
            .select('*, residents(name, flat, profile_id)')
            .order('created_at', { ascending: false });

        if (req.query.status && req.query.status !== 'all') {
            query = query.eq('status', req.query.status);
        }
        if (req.query.search) {
            query = query.ilike('title', `%${req.query.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

// PUT /api/admin/complaints/:id/status
router.put('/complaints/:id/status', ...auth, validate(complaintStatusSchema), async (req, res, next) => {
    try {
        const { status } = req.body;
        const { data, error } = await supabaseAdmin
            .from('complaints')
            .update({ status, updated_at: new Date() })
            .eq('id', req.params.id)
            .select('*, residents(name, flat, profile_id)')
            .single();
        if (error) throw error;

        if (data.residents?.profile_id) {
            const tmpl = NOTIFICATION_TEMPLATES.COMPLAINT_STATUS_UPDATED;
            await createNotification(
                data.residents.profile_id,
                tmpl.title,
                interpolate(tmpl.body, { title: data.title, status })
            );
        }

        return success(res, data, 'Complaint status updated');
    } catch (err) {
        next(err);
    }
});

// DELETE /api/admin/complaints/:id
router.delete('/complaints/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin
            .from('complaints')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Complaint deleted');
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/complaints/export
router.get('/complaints/export', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('complaints')
            .select('*, residents(name, flat)')
            .order('created_at', { ascending: false });
        if (error) throw error;

        const csv = [
            'ID,Resident,Flat,Title,Status,Created',
            ...data.map(c =>
                `${c.id},${c.residents?.name},${c.residents?.flat},"${c.title}",${c.status},${c.created_at}`
            ),
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=complaints_export.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
