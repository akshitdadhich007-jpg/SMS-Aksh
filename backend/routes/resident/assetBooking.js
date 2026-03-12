/**
 * Resident Asset Booking Routes — Connected to: AssetBooking.jsx (Resident)
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');
const { bookingSchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/assets', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('assets').select('*').order('created_at');
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/bookings', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('asset_bookings').select('*, assets(name)').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/bookings', ...auth, validate(bookingSchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { asset_id, date, start_time, end_time, purpose } = req.body;
        const { data, error } = await supabaseAdmin.from('asset_bookings').insert({ asset_id, resident_id: resident.id, date, start_time, end_time, purpose }).select().single();
        if (error) throw error;
        return success(res, data, 'Booking requested', 201);
    } catch (err) { next(err); }
});

router.delete('/bookings/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('asset_bookings').update({ status: 'cancelled' }).eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Booking cancelled');
    } catch (err) { next(err); }
});

module.exports = router;
