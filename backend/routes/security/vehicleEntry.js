/**
 * Security Vehicle Entry Routes — Connected to: VehicleEntry.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');
const { vehicleEntrySchema } = require('../../config/schemas');

const auth = [authenticateJWT, authorizeRole(ROLES.SECURITY)];

router.get('/vehicles', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('vehicle_logs').select('*').order('entry_time', { ascending: false }).limit(50);
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/vehicle/entry', ...auth, validate(vehicleEntrySchema), async (req, res, next) => {
    try {
        const { vehicle_number, vehicle_type, driver_name, purpose, flat } = req.body;
        const { data, error } = await supabaseAdmin.from('vehicle_logs').insert({ vehicle_number, vehicle_type, owner_name: driver_name, flat, purpose, logged_by: req.user.id }).select().single();
        if (error) throw error;
        return success(res, data, 'Vehicle entry logged', 201);
    } catch (err) { next(err); }
});

module.exports = router;
