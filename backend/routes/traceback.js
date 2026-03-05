/**
 * Traceback (Lost & Found) Routes — Shared across Admin/Resident/Security
 * ────────────────────────────────────────────────────────────────────────
 * Connected to: LostAndFoundTraceback.jsx, ReportLostItem.jsx, ReportFoundItem.jsx,
 *               TracebackMatches.jsx, ProveOwnership.jsx, FinderClaimReview.jsx,
 *               ClaimsPanel.jsx, LostItems.jsx, FoundItems.jsx
 */

const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { authenticateJWT } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { supabaseAdmin } = require('../config/supabase');
const { uploadFile } = require('../services/storageService');
const { runMatching } = require('../services/matchingService');
const config = require('../config/env');
const { createNotification } = require('../services/notificationService');
const { broadcast } = require('../services/realtimeService');
const { CLAIM_STATUS, ITEM_STATUS, NOTIFICATION_TEMPLATES, interpolate } = require('../config/constants');
const { success } = require('../utils/apiResponse');
const { claimStatusSchema } = require('../config/schemas');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/traceback/lost
router.post('/lost', authenticateJWT, upload.array('images', 5), async (req, res, next) => {
    try {
        const { category, description, color, dateLost, locationLost, contact, consent } = req.body;
        const imageUrls = [];
        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadFile(config.storageBucketLostFound, file.buffer, file.originalname, 'lost');
                imageUrls.push(result.url);
            }
        }
        const { data, error } = await supabaseAdmin.from('lost_items').insert({
            reported_by: req.user.id, category, description, color,
            date_lost: dateLost, location_lost: locationLost, contact,
            consent: consent === 'true' || consent === true, images: imageUrls,
        }).select().single();
        if (error) throw error;
        const matches = await runMatching('lost', data);
        return success(res, { item: data, matchesFound: matches?.length || 0 }, 'Lost item reported', 201);
    } catch (err) { next(err); }
});

// POST /api/traceback/found
router.post('/found', authenticateJWT, upload.array('images', 5), async (req, res, next) => {
    try {
        const { category, description, color, dateFound, locationFound, contact } = req.body;
        const imageUrls = [];
        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadFile(config.storageBucketLostFound, file.buffer, file.originalname, 'found');
                imageUrls.push(result.url);
            }
        }
        const { data, error } = await supabaseAdmin.from('found_items').insert({
            reported_by: req.user.id, category, description, color,
            date_found: dateFound, location_found: locationFound, contact, images: imageUrls,
        }).select().single();
        if (error) throw error;
        const matches = await runMatching('found', data);
        return success(res, { item: data, matchesFound: matches?.length || 0 }, 'Found item reported', 201);
    } catch (err) { next(err); }
});

// GET /api/traceback/items
router.get('/items', authenticateJWT, async (req, res, next) => {
    try {
        const [lostResult, foundResult] = await Promise.all([
            supabaseAdmin.from('lost_items').select('*').order('created_at', { ascending: false }),
            supabaseAdmin.from('found_items').select('*').order('created_at', { ascending: false }),
        ]);
        return success(res, { lostItems: lostResult.data || [], foundItems: foundResult.data || [] });
    } catch (err) { next(err); }
});

// GET /api/traceback/matches
router.get('/matches', authenticateJWT, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('traceback_matches').select('*, lost_items(*), found_items(*)').order('score', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

// POST /api/traceback/claim
router.post('/claim', authenticateJWT, upload.single('proofImage'), async (req, res, next) => {
    try {
        const { match_id, lost_item_id, found_item_id, description, uniqueMarks, lostLocation, notes } = req.body;
        let proof_image_url = null;
        if (req.file) {
            const result = await uploadFile(config.storageBucketProofs, req.file.buffer, req.file.originalname);
            proof_image_url = result.url;
        }
        const claim_token = uuidv4().slice(0, 8).toUpperCase();
        const { data, error } = await supabaseAdmin.from('claims').insert({
            match_id, claimant_id: req.user.id, lost_item_id, found_item_id,
            description, unique_marks: uniqueMarks, lost_location: lostLocation,
            notes, proof_image_url, claim_token,
        }).select().single();
        if (error) throw error;
        return success(res, data, 'Claim submitted', 201);
    } catch (err) { next(err); }
});

// GET /api/traceback/claims
router.get('/claims', authenticateJWT, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('claims').select('*, lost_items(category, description), found_items(category, description)').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

// PUT /api/traceback/claim/:id
router.put('/claim/:id', authenticateJWT, validate(claimStatusSchema), async (req, res, next) => {
    try {
        const { status, adminComment, rejectReason } = req.body;
        const { data, error } = await supabaseAdmin.from('claims').update({
            status, admin_comment: adminComment || null,
            reject_reason: rejectReason || null, updated_at: new Date(),
        }).eq('id', req.params.id).select().single();
        if (error) throw error;

        // Notify claimant using templates
        if (data.claimant_id) {
            const templateMap = {
                [CLAIM_STATUS.APPROVED]: NOTIFICATION_TEMPLATES.CLAIM_APPROVED,
                [CLAIM_STATUS.REJECTED]: NOTIFICATION_TEMPLATES.CLAIM_REJECTED,
                [CLAIM_STATUS.INFO_REQUESTED]: NOTIFICATION_TEMPLATES.CLAIM_INFO_REQUESTED,
            };
            const tmpl = templateMap[status];
            if (tmpl) {
                await createNotification(data.claimant_id, tmpl.title, interpolate(tmpl.body, { reason: rejectReason || 'Not specified' }));
            }
            await broadcast(`claim_updates:${data.claimant_id}`, 'claim_status_changed', data);
        }

        if (status === CLAIM_STATUS.APPROVED) {
            await supabaseAdmin.from('lost_items').update({ status: ITEM_STATUS.CLAIMED }).eq('id', data.lost_item_id);
            await supabaseAdmin.from('found_items').update({ status: ITEM_STATUS.CLAIMED }).eq('id', data.found_item_id);
        }

        return success(res, data, 'Claim updated');
    } catch (err) { next(err); }
});

module.exports = router;
