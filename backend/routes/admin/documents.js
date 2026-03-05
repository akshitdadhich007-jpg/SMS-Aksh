/**
 * Admin Document Repository Routes
 * ─────────────────────────────────
 * Connected to: DocumentRepo.jsx
 */

const router = require('express').Router();
const multer = require('multer');
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { uploadFile } = require('../../services/storageService');
const { ROLES } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const upload = multer({ storage: multer.memoryStorage() });
const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/documents', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) {
        next(err);
    }
});

router.post('/documents', ...auth, upload.single('file'), async (req, res, next) => {
    try {
        let file_url = null;
        if (req.file) {
            const result = await uploadFile('documents', req.file.buffer, req.file.originalname);
            file_url = result.url;
        }

        const { name, type, size } = req.body;
        const { data, error } = await supabaseAdmin
            .from('documents')
            .insert({ name, type, size, file_url, uploaded_by: req.user.id })
            .select()
            .single();
        if (error) throw error;
        return success(res, data, 'Document uploaded', 201);
    } catch (err) {
        next(err);
    }
});

router.get('/documents/:id/download', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('documents')
            .select('file_url, name')
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        return success(res, { url: data.file_url, name: data.name });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
