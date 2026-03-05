/**
 * Admin Asset Booking Routes — Connected to: AssetBooking.jsx (Admin)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { assetSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/assets', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('assets').select('*').order('created_at');
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/assets', ...auth, validate(assetSchema), async (req, res, next) => {
    try {
        const { name, description, capacity, charges, booking_rules } = req.body;
        const { data, error } = await supabaseAdmin.from('assets').insert({ name, description, capacity, charges, booking_rules }).select().single();
        if (error) throw error;
        return success(res, data, 'Asset added', 201);
    } catch (err) { next(err); }
});

router.put('/assets/:id', ...auth, validate(assetSchema), async (req, res, next) => {
    try {
        const { name, description, capacity, charges, booking_rules } = req.body;
        const { data, error } = await supabaseAdmin.from('assets').update({ name, description, capacity, charges, booking_rules }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Asset updated');
    } catch (err) { next(err); }
});

router.delete('/assets/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('assets').delete().eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Asset deleted');
    } catch (err) { next(err); }
});

router.get('/bookings', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('asset_bookings').select('*, assets(name), residents(name, flat, profile_id)').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.put('/bookings/:id/approve', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('asset_bookings').update({ status: 'approved' }).eq('id', req.params.id).select('*, residents(name, flat, profile_id), assets(name)').single();
        if (error) throw error;
        if (data.residents?.profile_id) {
            await createNotification(data.residents.profile_id, 'Booking Approved', `Your booking for ${data.assets?.name} on ${data.date} has been approved.`);
        }
        return success(res, data, 'Booking approved');
    } catch (err) { next(err); }
});

router.put('/bookings/:id/reject', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('asset_bookings').update({ status: 'rejected' }).eq('id', req.params.id).select('*, residents(name, flat, profile_id), assets(name)').single();
        if (error) throw error;
        if (data.residents?.profile_id) {
            await createNotification(data.residents.profile_id, 'Booking Rejected', `Your booking for ${data.assets?.name} on ${data.date} has been rejected.`);
        }
        return success(res, data, 'Booking rejected');
    } catch (err) { next(err); }
});

module.exports = router;
