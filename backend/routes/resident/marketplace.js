/**
 * Resident Marketplace Routes — Connected to: MarketplaceList.jsx, CreateListing.jsx, etc.
 */
const router = require('express').Router();
const multer = require('multer');
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const { uploadFile } = require('../../services/storageService');
const { broadcast } = require('../../services/realtimeService');
const { ROLES, LISTING_STATUS } = require('../../config/constants');
const { success, fail } = require('../../utils/apiResponse');
const { enquirySchema, visitSchema, favoriteSchema, priceUpdateSchema, featuresUpdateSchema } = require('../../config/schemas');

const upload = multer({ storage: multer.memoryStorage() });
const auth = [authenticateJWT, authorizeRole(ROLES.RESIDENT)];

router.get('/marketplace', ...auth, async (req, res, next) => {
    try {
        let query = supabaseAdmin.from('listings').select('*, residents(name, flat)');
        if (req.query.type && req.query.type !== 'all') query = query.eq('type', req.query.type);
        if (req.query.search) query = query.ilike('title', `%${req.query.search}%`);
        if (req.query.bedrooms && req.query.bedrooms !== 'all') query = query.eq('bedrooms', parseInt(req.query.bedrooms));
        if (req.query.furnishing && req.query.furnishing !== 'all') query = query.eq('furnishing', req.query.furnishing);
        query = query.in('status', [LISTING_STATUS.ACTIVE, LISTING_STATUS.PENDING]).order('created_at', { ascending: false });
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const from = (page - 1) * limit;
        query = query.range(from, from + limit - 1);
        const { data, error, count } = await query;
        if (error) throw error;
        return success(res, { listings: data, page, totalCount: count });
    } catch (err) { next(err); }
});

router.get('/marketplace/my', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('listings').select('*').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/marketplace/favorites', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { data, error } = await supabaseAdmin.from('favorites').select('*, listings(*)').eq('resident_id', resident.id).order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/marketplace/:id', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').select('*, residents(name, flat)').eq('id', req.params.id).single();
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.post('/marketplace', ...auth, upload.array('images', 10), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id, flat').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const imageUrls = [];
        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadFile('marketplace-images', file.buffer, file.originalname);
                imageUrls.push(result.url);
            }
        }
        const { type, title, description, price, bedrooms, bathrooms, area, furnishing, status } = req.body;
        const { data, error } = await supabaseAdmin.from('listings').insert({
            resident_id: resident.id, flat_number: resident.flat, type, title, description,
            price: parseFloat(price) || 0, bedrooms: parseInt(bedrooms) || 0, bathrooms: parseInt(bathrooms) || 0,
            area: parseFloat(area) || 0, furnishing, images: imageUrls, status: status || LISTING_STATUS.PENDING,
        }).select().single();
        if (error) throw error;
        return success(res, data, 'Listing created', 201);
    } catch (err) { next(err); }
});

router.post('/marketplace/enquiry', ...auth, validate(enquirySchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { listing_id, message } = req.body;
        const { data, error } = await supabaseAdmin.from('enquiries').insert({ listing_id, sender_id: resident.id, message }).select().single();
        if (error) throw error;
        await broadcast('marketplace_enquiries', 'new_enquiry', data);
        return success(res, data, 'Enquiry sent', 201);
    } catch (err) { next(err); }
});

router.post('/marketplace/visit', ...auth, validate(visitSchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { listing_id, date, time } = req.body;
        const { data, error } = await supabaseAdmin.from('marketplace_visits').insert({ listing_id, visitor_id: resident.id, date, time }).select().single();
        if (error) throw error;
        return success(res, data, 'Visit scheduled', 201);
    } catch (err) { next(err); }
});

router.post('/marketplace/favorite', ...auth, validate(favoriteSchema), async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        const { listing_id } = req.body;
        const { data: existing } = await supabaseAdmin.from('favorites').select('id').eq('resident_id', resident.id).eq('listing_id', listing_id).single();
        if (existing) {
            await supabaseAdmin.from('favorites').delete().eq('id', existing.id);
            return success(res, { favorited: false });
        } else {
            await supabaseAdmin.from('favorites').insert({ resident_id: resident.id, listing_id });
            return success(res, { favorited: true });
        }
    } catch (err) { next(err); }
});

router.delete('/marketplace/favorites', ...auth, async (req, res, next) => {
    try {
        const { data: resident } = await supabaseAdmin.from('residents').select('id').eq('profile_id', req.user.id).single();
        if (!resident) return fail(res, 'Resident not found', 404);
        await supabaseAdmin.from('favorites').delete().eq('resident_id', resident.id);
        return success(res, null, 'All favorites cleared');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/price', ...auth, validate(priceUpdateSchema), async (req, res, next) => {
    try {
        const { price } = req.body;
        const { data, error } = await supabaseAdmin.from('listings').update({ price, updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Price updated');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/withdraw', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: 'withdrawn', updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Listing withdrawn');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/features', ...auth, validate(featuresUpdateSchema), async (req, res, next) => {
    try {
        const { features } = req.body;
        const { data, error } = await supabaseAdmin.from('listings').update({ features, updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Features updated');
    } catch (err) { next(err); }
});

module.exports = router;
