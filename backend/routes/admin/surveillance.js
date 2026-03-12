/**
 * Admin Smart Surveillance Routes — Connected to: SmartSurveillance.jsx
 */
const router = require('express').Router();
const multer = require('multer');
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { uploadFile } = require('../../services/storageService');
const config = require('../../config/env');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const upload = multer({ storage: multer.memoryStorage() });
const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/surveillance', ...auth, async (req, res, next) => {
    try {
        let query = supabaseAdmin.from('violations').select('*').order('detected_at', { ascending: false });
        if (req.query.type) query = query.eq('type', req.query.type);
        const { data, error } = await query;
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/surveillance', ...auth, upload.single('image'), async (req, res, next) => {
    try {
        let image_url = null;
        if (req.file) {
            const result = await uploadFile(config.storageBucketSurveillance, req.file.buffer, req.file.originalname);
            image_url = result.url;
        }
        const { type } = req.body;
        const { data, error } = await supabaseAdmin.from('violations').insert({ type, image_url }).select().single();
        if (error) throw error;
        return success(res, data, 'Violation recorded', 201);
    } catch (err) { next(err); }
});

router.delete('/surveillance/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('violations').delete().eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Violation deleted');
    } catch (err) { next(err); }
});

router.get('/surveillance/export', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('violations').select('*').order('detected_at', { ascending: false });
        if (error) throw error;
        const csv = [
            'ID,Type,Image URL,Detected At,Status',
            ...data.map(v => `${v.id},${v.type},${v.image_url},${v.detected_at},${v.status}`),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=surveillance_export.csv');
        res.send(csv);
    } catch (err) { next(err); }
});

module.exports = router;
